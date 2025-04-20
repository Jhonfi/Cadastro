import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./../styles/forms.css";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);

      setMessage('Login bem-sucedido!');
      setUsername('');
      setPassword('');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro durante o login:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(`Erro: ${error.response.data.message}`);
      } else if (error.message) {
        setMessage(`Erro: ${error.message}`);
      } else {
        setMessage('Ocorreu um erro ao tentar fazer login. Verifique suas credenciais.');
      }
      localStorage.removeItem('token');
    }
  };

  const handleRedirectToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label>Usuário:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>

        {/* Botão para redirecionar ao registro */}
        <button
          type="button"
          onClick={handleRedirectToRegister}
          style={{
            backgroundColor: 'transparent',
            color: 'var(--text-light-gray)',
            border: '1px solid var(--spotify-light-gray)',
            marginTop: '10px',
            fontSize: '0.95em',
          }}
        >
          Ainda não tem conta? Registre-se
        </button>
      </form>

      {message && (
        <p className={`auth-message ${message.toLowerCase().includes('erro') ? 'error' : 'success'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Login;
