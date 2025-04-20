const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('Tentando conectar ao banco de dados...');

const dbPath = path.resolve(__dirname, '../db/database.sqlite');
console.log('Caminho do banco de dados:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('SUCESSO: Conectado ao banco de dados SQLite.');

    console.log('Verificando/Criando tabela de usuários...');
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE
    )`, (err) => {
      if (err) {
        console.error('Erro ao criar tabela de usuários:', err.message);
      } else {
        console.log('SUCESSO: Tabela de usuários verificada/criada.');
      }
    });
  }
});

module.exports = db;
