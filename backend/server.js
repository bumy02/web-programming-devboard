const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기본 연결 테스트용
app.get('/api/test', (req, res) => {
  res.json({ message: "성공적으로 백엔드와 연결되었습니다! 🚀" });
});

// 1. 회원가입 API
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 이메일 중복 체크
    const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: '이미 존재하는 이메일입니다.' });
    }

    // 비밀번호 해싱 (암호화)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 사용자 등록
    const newUser = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    res.status(201).json({ message: '회원가입 성공!', user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 에러가 발생했습니다.' });
  }
});

// 2. 로그인 API
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 사용자 조회
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const user = userResult.rows[0];

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 발급
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // 1일 동안 유효
    );

    res.json({ message: '로그인 성공!', token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 에러가 발생했습니다.' });
  }
});

// JWT 인증 미들웨어 (요청할 때마다 토큰이 맞는지 검사)
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: '인증 토큰이 없습니다.' });

  const token = authHeader.split(' ')[1]; // "Bearer 토큰값" 에서 토큰값만 분리
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 검증된 사용자(id, email) 정보를 req에 저장
    next();
  } catch (err) {
    res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
};

// 1. 내 할 일(Task) 목록 불러오기 API
app.get('/api/tasks', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY position ASC, id ASC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: '서버 에러가 발생했습니다.' });
  }
});

// 2. 새 할 일(Task) 추가 API
app.post('/api/tasks', authenticate, async (req, res) => {
  const { title, description, status, position } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (user_id, title, description, status, position) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, title, description || '', status || 'TODO', position || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: '서버 에러가 발생했습니다.' });
  }
});

// 3. 할 일 상태(컬럼) 업데이트 API (드래그 앤 드롭 후 상태 변경용)
app.put('/api/tasks/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { status, position } = req.body;
  try {
    const result = await pool.query(
      'UPDATE tasks SET status = $1, position = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
      [status, position, id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: '서버 에러가 발생했습니다.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});