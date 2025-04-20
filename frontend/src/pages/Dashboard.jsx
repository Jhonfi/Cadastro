import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './../styles/forms.css';

function Dashboard() {
  const [message, setMessage] = useState('Carregando dados protegidos...');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessage(`Dados do Perfil: ${JSON.stringify(response.data.user)}`);
      } catch (error) {
        console.error('Erro ao buscar dados protegidos:', error);

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/login');
          setMessage('Sessão expirada ou token inválido. Faça login novamente.');
        } else {
          setMessage('Erro ao carregar dados protegidos.');
        }
      }
    };

    fetchProtectedData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <h2>Dashboard</h2>
      <div className="auth-message">{message}</div>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}

export default Dashboard;
