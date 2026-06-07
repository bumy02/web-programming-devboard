import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Board from './components/Board'; // Board 컴포넌트 불러오기

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div>
      {isAuthenticated ? (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>DevBoard</h1>
            <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              로그아웃
            </button>
          </header>
          <hr style={{ margin: '20px 0' }}/>
          
          {/* 보드 컴포넌트 렌더링 */}
          <Board />
          
        </div>
      ) : (
        <Auth onLogin={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default App;