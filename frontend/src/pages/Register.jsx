import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- Importe useNavigate aqui
import './../styles/forms.css'; // <-- Verifique se o nome do seu arquivo CSS está correto aqui (AuthForms.css?)

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // <-- Inicialize useNavigate aqui

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!username || !password || !email) {
      setMessage('Todos os campos são obrigatórios!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/register', {
        username,
        password,
        email,
      });

      console.log('Resposta do backend (registro):', response.data);
      setMessage('Registro bem-sucedido! Redirecionando...'); // <-- Mensagem antes de redirecionar

      // Limpa os campos de formulário após o registro (opcional, pode vir antes ou depois do redirect)
      setUsername('');
      setPassword('');
      setEmail('');

      // *** REDIRECIONA PARA A PÁGINA DE LOGIN APÓS O SUCESSO ***
      navigate('/login');


    } catch (error) {
      console.error('Erro durante o registro:', error);

      if (error.response && error.response.data && error.response.data.message) {
        setMessage(`Erro: ${error.response.data.message}`);
      } else {
        setMessage('Ocorreu um erro ao tentar registrar. Tente novamente.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Cadastro</h2>
      <form className="auth-form" onSubmit={handleRegister}>
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
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Cadastrar</button>
      </form>

      {message && (
        <p className={`auth-message ${message.toLowerCase().includes('erro') ? 'error' : 'success'}`}>
          {message}
        </p>
      )}

       {/* Adicionar Link para Login aqui se quiser (Passo 24) */}
       {/* <p>Já tem uma conta? <Link to="/login">Entre aqui</Link></p> */}

    </div>
  );
}

export default Register;