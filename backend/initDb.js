const pool = require('./db');

const createTables = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'TODO', -- 'TODO', 'IN_PROGRESS', 'DONE'
      position INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    console.log('테이블 생성 중...');
    await pool.query(queryText);
    console.log('테이블이 성공적으로 생성되었습니다! 🚀');
    process.exit(0);
  } catch (err) {
    console.error('테이블 생성 중 에러 발생:', err);
    process.exit(1);
  }
};

createTables();