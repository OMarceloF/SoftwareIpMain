// Carregando dependências
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Criando a base de dados (MySQL)
const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '',
  database: 'test'
});

// Conectando ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.stack);
    return;
  }
  console.log('Conectado ao banco de dados como ID', db.threadId);
});

// Criando uma rota para buscar a tabela unidades
app.get('/unidades', (req, res) => {
  // Criando SQL para selecionar os dados
  const SQL = 'SELECT cidade, coordenador FROM unidades';

  db.query(SQL, (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

app.post('/aula', (req, res) => {
  const { date, unidade, regente, nota, comentarios } = req.body;

  const SQL = 'INSERT INTO aula (date, unidade, regente, nota, comentarios) VALUES (?, ?, ?, ?, ?)';
  const values = [date, unidade, regente, nota, comentarios];

  db.query(SQL, values, (err, results) => {
    if (err){
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' });
  })
})

// Adicionando uma rota para salvar dados na tabela contato
app.post('/contato', (req, res) => {
  const { date, retorno, comentarios } = req.body;

  const SQL = 'INSERT INTO contato (date, retorno, comentarios) VALUES (?, ?, ?)';
  const values = [date, retorno, comentarios];

  db.query(SQL, values, (err, results) => {
      if (err) {
          console.error('Erro ao inserir dados:', err);
          return res.status(500).send({ error: err });
      }
      res.status(200).send({ message: 'Dados inseridos com sucesso!' });
  });
});


// Rodando o servidor
app.listen(3002, () => {
  console.log('Server is running on port 3002');
});


// Criando uma rota até o servidor para criar usuários
app.post('/register', (req, res) => {
  // Pegando as variáveis
  const email = req.body.Email;
  const username = req.body.UserName;
  const password = req.body.Password;

  // Verificando se as variáveis foram recebidas corretamente
  console.log('Email:', email);
  console.log('Username:', username);
  console.log('Password:', password);

  // Criando SQL para inserir os dados
  const SQL = 'INSERT INTO coordenadores (email, username, password) VALUES (?, ?, ?)';
  const values = [email, username, password];

  // Conectando ao SQL
  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send(err);
    } else {
      console.log('Usuário criado com sucesso!');
      res.status(200).send({ message: 'Usuário adicionado!' });
    }
  });
});

// Criando uma rota até o servidor para logar
app.post('/login', (req, res) => {
  const loginEmail = req.body.LoginEmail;
  const loginPassword = req.body.LoginPassword;

  // Verificando se as variáveis foram recebidas corretamente
  console.log('Login Email:', loginEmail);
  console.log('Login Password:', loginPassword);

  // Criando SQL para selecionar os dados
  const SQL = 'SELECT * FROM coordenadores WHERE email = ? AND password = ?';
  const values = [loginEmail, loginPassword];

  // Conectando ao SQL
  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      return res.status(500).send({ error: err });
    }
    if (results.length > 0) {
      res.status(200).send(results);
    } else {
      res.status(401).send({ message: 'Credenciais não encontradas!' });
    }
  });
});
