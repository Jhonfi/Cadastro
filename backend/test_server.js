const http = require('http');

const hostname = '127.0.0.1';
const port = 3005;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Servidor de teste rodando!\n');
});

server.listen(port, hostname, () => {
  console.log(`Servidor de teste rodando em http://${hostname}:${port}/`);
});

server.on('error', (e) => {
  console.error('Erro no servidor HTTP de teste:', e);
});

process.on('uncaughtException', (err) => {
  console.error('Erro NÃO CAPTURADO no processo de teste:', err);
  process.exit(1);
});
