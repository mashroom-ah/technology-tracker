import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === 'admin' && password === 'password') {
      onLogin(username);
      navigate('/');
    } else {
      alert('Неверные данные для входа. Используйте admin/password');
    }
  };

  return (
    <div className="page">
      <div className="login-page">
        <div className="login-container">
          <h1>🔐 Вход в систему</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Имя пользователя:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Введите admin"
              />
            </div>

            <div className="form-group">
              <label>Пароль:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Введите password"
              />
            </div>

            <button type="submit" className="btn btn-primary login-btn">
              Войти
            </button>
          </form>

          <div className="login-hint">
            <p><strong>Тестовые данные для входа:</strong></p>
            <p>👤 Имя пользователя: <code>admin</code></p>
            <p>🔒 Пароль: <code>password</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;