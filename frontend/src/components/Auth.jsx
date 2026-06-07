import { useState } from 'react';
import axios from 'axios';

function Auth({ onLogin }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/signup';

    try {
      const response = await axios.post(endpoint, { email, password });
      
      if (isLoginMode) {
        // 로그인 성공 시 JWT 토큰을 localStorage에 저장
        localStorage.setItem('token', response.data.token);
        alert(response.data.message);
        onLogin(); // App.jsx에 로그인 성공 알림
      } else {
        // 회원가입 성공 시
        alert('회원가입이 완료되었습니다. 이제 로그인해 주세요!');
        setIsLoginMode(true); // 로그인 화면으로 전환
        setPassword('');
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.error || '오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{isLoginMode ? '로그인' : '회원가입'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="email" 
          placeholder="이메일" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          type="password" 
          placeholder="비밀번호" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        {errorMsg && <p style={{ color: 'red', fontSize: '14px', margin: '0' }}>{errorMsg}</p>}
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isLoginMode ? '로그인' : '회원가입'}
        </button>
      </form>
      <p style={{ marginTop: '15px', fontSize: '14px', textAlign: 'center' }}>
        {isLoginMode ? '계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
        <span 
          style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }} 
          onClick={() => { setIsLoginMode(!isLoginMode); setErrorMsg(''); }}
        >
          {isLoginMode ? '회원가입 하기' : '로그인 하기'}
        </span>
      </p>
    </div>
  );
}

export default Auth;