require('dotenv').config();
const express = require('express');
const db = require('./src/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./src/middleware/auth');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Middleware para analisar JSON, antes das rotas

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Backend de Autenticação rodando!');
});

app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Erro ao gerar hash da senha:', err);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }

    db.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email],
      function(err) {
        if (err) {
          console.error('Erro ao inserir usuário:', err.message);
          if (err.message.includes('UNIQUE constraint failed')) {
               return res.status(409).json({ message: 'Nome de usuário ou E-mail já cadastrado.' });
          }
          return res.status(500).json({ message: 'Erro ao registrar usuário.' });
        }
        console.log(`Usuário ${username} registrado com sucesso com ID: ${this.lastID}`);
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
      }
    );
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err.message);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error('Erro ao comparar senhas:', err);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
      }

      if (!result) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      console.log(`Usuário ${username} logado com sucesso.`);
      res.status(200).json({ message: 'Login bem-sucedido!', token });
    });
  });
});

// Rota Protegida usando o middleware authenticateToken
app.get('/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'Você tem acesso a dados protegidos!',
    user: req.user // Dados do usuário vêm do payload do JWT
  });
});


process.on('uncaughtException', (err) => {
  console.error('Erro NÃO CAPTURADO (uncaughtException):', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promessa Rejeitada NÃO CAPTURADA (unhandledRejection):', reason);
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});