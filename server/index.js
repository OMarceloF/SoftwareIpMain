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

// Adicionando uma rota para salvar dados na tabela aulas
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

// Adicionando uma rota para salvar dados na tabela diarios
app.post('/diarios', (req, res) => {
  const { date, unidade, regente, nota, comentarios } = req.body;

  const SQL = 'INSERT INTO diarios (date, unidade, regente, nota, comentarios) VALUES (?, ?, ?, ?, ?)';
  const values = [date, unidade, regente, nota, comentarios];

  db.query(SQL, values, (err, results) => {
    if(err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

// Adicionando uma rota para salvar dados na tabela fotosevideos
app.post('/fotosEVideos', (req, res) => {
  const { date, nota, comentarios } = req.body;

  const SQL = 'INSERT INTO fotosevideos (date, nota, comentarios) VALUES (?, ?, ?)';
  const values = [date, nota, comentarios];

  db.query(SQL, values, (err, results) => {
    if(err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

// Adicionando uma rota para salvar dados na tabela Guide
app.post('/guide', (req, res) => {
  const { date, unidade, turma, conformidade, comentarios } = req.body;

  const SQL = 'INSERT INTO guide (date, unidade, turma, conformidade, comentarios) VALUES (?, ?, ?, ?, ?)';
  const values = [date, unidade, turma, conformidade, comentarios];

  db.query(SQL, values, (err, results) => {
    if(err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

// Adicionando uma rota para salvar dados na tabela Inventario
app.post('/inventario', (req, res) => {
  const { date, unidade, regente, comentarios, quem, resolvido } = req.body;

  const SQL = 'INSERT INTO inventario (date, unidade, regente, comentarios, quem, resolvido) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [date, unidade, regente, comentarios, quem, resolvido];

  db.query(SQL, values, (err, results) => {
    if(err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

// Adicionando uma rota para salvar dados na tabela Planos
app.post('/planos', (req, res) => {
  const { date, unidade, regente, nota, comentarios } = req.body;

  const SQL = 'INSERT INTO planos (date, unidade, regente, nota, comentarios) VALUES (?, ?, ?, ?, ?)';
  const values = [date, unidade, regente, nota, comentarios];

  db.query(SQL, values, (err, results) => {
    if(err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

// Adicionando uma rota para salvar dados na tabela Propostas
app.post('/propostas', (req, res) => {
  const { date, unidade, regente, comentarios } = req.body;

  const SQL = 'INSERT INTO propostas (date, unidade, regente, comentarios) VALUES (?, ?, ?, ?)';
  const values = [date, unidade, regente, comentarios];

  db.query(SQL, values, (err, results) => {
    if(err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

// Adicionando uma rota para salvar dados na tabela Unidades
app.post('/unidades', (req, res) => {
  const { cidade, coordenador } = req.body;

  const SQL = 'INSERT INTO unidades (cidade, coordenador) VALUES (?, ?)';
  const values = [cidade, coordenador];

  db.query(SQL, values, (err, results) => {
    if(err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

// Adicionando uma rota para buscar dados da tabela aula filtrados por unidade
app.get('/aula/:unidade', (req, res) => {
  const { unidade } = req.params;

  const SQL = 'SELECT date, nota FROM aula WHERE unidade = ?';
  const values = [unidade];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

// Rota para buscar dados de contato filtrados por unidade
app.get('/contato/:unidade', (req, res) => {
  const unidade = req.params.unidade;
  const SQL = 'SELECT date, retorno FROM contato WHERE unidade = ?';
  db.query(SQL, [unidade], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

// Adicionar rota para buscar dados da tabela diarios
app.get('/diarios/:unidade', (req, res) => {
  const unidade = req.params.unidade;
  
  // Criar SQL para selecionar os dados
  const SQL = 'SELECT date, nota FROM diarios WHERE unidade = ?';
  const values = [unidade];
  
  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

// Rota para buscar dados da tabela feira filtrados por unidade
app.get('/feira/:unidade', (req, res) => {
  const unidade = req.params.unidade;
  
  // Criar SQL para selecionar a linha mais recente para cada coluna
  const SQL = `
    SELECT date, cronograma, apresentacao, estrutural
    FROM feira
    WHERE unidade = ?
    ORDER BY date DESC
  `;
  const values = [unidade];
  
  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      return res.status(500).send({ error: err });
    }
    
    // Selecionar apenas a linha com a data mais recente
    const latestEntry = results[0]; // A linha mais recente já está na primeira posição
    res.status(200).send(latestEntry);
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
