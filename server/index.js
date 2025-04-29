// Carregando dependências
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
// 🔒 Controle de sessões em memória (sem alterar o banco)
const activeSessions = new Map(); // Estrutura: email -> { loginTime, lastActive }
const MAX_USERS = 5;
const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutos de inatividade

let db; // <- Declare fora da função

app.use(express.json());
app.use(cors());

async function testDatabaseConnection() {
  try {

    /*//localhost
    const connection = mysql.createPool({
      user: 'root',
      host: 'localhost',
      password: '',
      database: 'bpnjokvpezbjichmh33i',
      port: 3306
    });*/

    const connection = mysql.createPool({
      user: 'uuoouvnk3rn33xoi',
      host: 'bpnjokvpezbjichmh33i-mysql.services.clever-cloud.com',
      password: 'vGPPGUa2jDLrjbREgblx',
      database: 'bpnjokvpezbjichmh33i',
      port: 3306
    });

    const [rows, fields] = await connection.query('SELECT 1+1 AS result');
    console.log('✅ Conexão bem-sucedida no backend:', rows);

    await connection.end();
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados no backend:', error.message);
  }
}

// Testar a conexão ao iniciar o servidor
//testDatabaseConnection();

function connectDatabase() {
  db = mysql.createPool({
    user: 'uuoouvnk3rn33xoi',
    host: 'bpnjokvpezbjichmh33i-mysql.services.clever-cloud.com',
    password: 'vGPPGUa2jDLrjbREgblx',
    database: 'bpnjokvpezbjichmh33i',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0

    /*//localhost
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'bpnjokvpezbjichmh33i',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 5, // ou menor, dependendo do plano do banco
    queueLimit: 0*/
  });

  // Conectar ao banco
  /*db.connect((err) => {
    if (err) {
      console.error('❌ Erro ao conectar ao banco:', err.message);
      setTimeout(connectDatabase, 2000); // Se falhar, tenta reconectar em 2s
    } else {
      console.log('✅ Conectado ao banco de dados:', db.threadId);
    }
  });

  // Detectar desconexões e reconectar automaticamente
  db.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.warn('⚠️ Conexão perdida. Tentando reconectar...');
      connectDatabase();
    } else {
      throw err;
    }
  });*/
}


// 🔹 Inicia a conexão com o banco
connectDatabase();

// 🔹 Keep-Alive: Mantém a conexão ativa enviando uma query a cada 10 minutos
setInterval(() => {
  db.query('SELECT 1', (err) => {
    if (err) console.error('❌ Keep-Alive falhou:', err.message);
    else console.log('🔄 Keep-Alive bem-sucedido');
  });
}, 10 * 60 * 1000);


// 🔹 Teste de Conexão Inicial
db.query('SELECT 1 + 1 AS result', (err, results) => {
  if (err) {
    console.error('❌ Erro ao testar conexão:', err.message);
  } else {
    console.log('✅ Conexão testada com sucesso:', results);
  }
});

// Criando uma rota para buscar a tabela unidades
app.get('/unidades', (req, res) => {
  // Criando SQL para selecionar os dados
  const SQL = 'SELECT cidade, coordenador, endereco, telefone FROM unidades';

  db.query(SQL, (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

// Criando uma rota para buscar a tabela coordenadores
// Criando uma rota para buscar a tabela coordenadores com filtro
app.get('/coordenadores', (req, res) => {
  const SQL = "SELECT username FROM coordenadores WHERE role = 'user'";

  db.query(SQL, (err, results) => {
    if (err) {
      console.error('Erro ao buscar coordenadores:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});


app.post('/aula', (req, res) => {
  const {
    date, unidade, regente, nota, comentarios,
    conformidade_teachers_guide, planejamento_aula, oratoria_professor,
    dominio_tema, aplicacao_habilidades_competencias, construcao_pensamento,
    postura_professor, divisao_tempo_teoria_pratica, criatividade, motivacao_professor,
    controle_turma, atendimento_alunos, metodologia_ativa, nivel_atividade_proposta,
    time_aula, motivacao_alunos
  } = req.body;

  const SQL = `
    INSERT INTO aula (
      date, unidade, regente, nota, comentarios,
      conformidade_teachers_guide, planejamento_aula, oratoria_professor,
      dominio_tema, aplicacao_habilidades_competencias, construcao_pensamento,
      postura_professor, divisao_tempo_teoria_pratica, criatividade, motivacao_professor,
      controle_turma, atendimento_alunos, metodologia_ativa, nivel_atividade_proposta,
      time_aula, motivacao_alunos
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    date, unidade, regente, nota, comentarios,
    conformidade_teachers_guide, planejamento_aula, oratoria_professor,
    dominio_tema, aplicacao_habilidades_competencias, construcao_pensamento,
    postura_professor, divisao_tempo_teoria_pratica, criatividade, motivacao_professor,
    controle_turma, atendimento_alunos, metodologia_ativa, nivel_atividade_proposta,
    time_aula, motivacao_alunos
  ];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' });
  })
})

// Adicionando uma rota para salvar dados na tabela contato
app.post('/contato', (req, res) => {
  const { date, retorno, comentarios, unidade } = req.body;

  const SQL = 'INSERT INTO contato (date, retorno, comentarios, unidade) VALUES (?, ?, ?, ?)';
  const values = [date, retorno, comentarios, unidade];

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
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

// Adicionando uma rota para salvar dados na tabela fotosevideos
app.post('/fotosEVideos', (req, res) => {
  const { date, nota, comentarios, unidade } = req.body;

  const SQL = 'INSERT INTO fotosevideos (date, nota, comentarios, unidade) VALUES (?, ?, ?, ?)';
  const values = [date, nota, comentarios, unidade];

  db.query(SQL, values, (err, results) => {
    if (err) {
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
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

app.post('/inventario', (req, res) => {
  let { date, unidade, regente, comentarios, quem, resolvido } = req.body;

  // Converte 'Sim' para 1 e 'Não' para 0
  resolvido = resolvido === 'Sim' ? 1 : 0;

  const SQL = 'INSERT INTO inventario (date, unidade, regente, comentarios, quem, resolvido) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [date, unidade, regente, comentarios, quem, resolvido];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' });
  });
});


// Adicionando uma rota para salvar dados na tabela Planos
app.post('/planos', (req, res) => {
  const { date, unidade, regente, nota, comentarios } = req.body;

  const SQL = 'INSERT INTO planos (date, unidade, regente, nota, comentarios) VALUES (?, ?, ?, ?, ?)';
  const values = [date, unidade, regente, nota, comentarios];

  db.query(SQL, values, (err, results) => {
    if (err) {
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
    if (err) {
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
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

// Adicionando uma rota para salvar dados na tabela aulaCor
app.post('/aulacor', (req, res) => {
  const {
    date, unidade, nota, comentarios, coordenador,
  } = req.body;

  const SQL = `
    INSERT INTO aulacor (
      date, unidade, nota, comentarios, coordenador
    ) VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    date, unidade, nota, comentarios, coordenador,
  ];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' });
  });
});

// Adicionando uma rota para salvar dados na tabela contatoCor
app.post('/contatocor', (req, res) => {
  const { date, retorno, comentarios, coordenador } = req.body;

  const SQL = 'INSERT INTO contatocor (date, retorno, comentarios, coordenador) VALUES (?, ?, ?, ?)';
  const values = [date, retorno, comentarios, coordenador];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

// Adicionando uma rota para salvar dados na tabela diariosCor
app.post('/diarioscor', (req, res) => {
  const { date, nota, comentarios, coordenador } = req.body;

  const SQL = 'INSERT INTO diarioscor (date, nota, comentarios, coordenador) VALUES (?, ?, ?, ?)';
  const values = [date, nota, comentarios, coordenador];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

app.post('/feira', (req, res) => {
  const { unidade, cronograma, estrutural, apresentacao, comentarios, date } = req.body;

  const SQL = 'INSERT INTO feira (unidade, cronograma, estrutural, apresentacao, comentarios, date) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [unidade, cronograma, estrutural, apresentacao, comentarios, date];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

// Adicionando uma rota para salvar dados na tabela feiraCor
app.post('/feiracor', (req, res) => {
  const { coordenador, cronograma, estrutural, apresentacao, comentarios, date } = req.body;

  const SQL = 'INSERT INTO feiracor (coordenador, cronograma, estrutural, apresentacao, comentarios, date) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [coordenador, cronograma, estrutural, apresentacao, comentarios, date];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

// Adicionando uma rota para salvar dados na tabela fotosevideosCor
app.post('/fotosevideoscor', (req, res) => {
  const { coordenador, date, nota, comentarios } = req.body;

  const SQL = 'INSERT INTO fotosevideoscor (coordenador, date, nota, comentarios) VALUES (?, ?, ?, ?)';
  const values = [coordenador, date, nota, comentarios];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

// Adicionando uma rota para salvar dados na tabela guidecor
app.post('/guidecor', (req, res) => {
  const { coordenador, date, conformidade, comentarios } = req.body;

  const SQL = 'INSERT INTO guidecor (coordenador, date, conformidade, comentarios) VALUES (?, ?, ?, ?)';
  const values = [coordenador, date, conformidade, comentarios];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

// Adicionando uma rota para salvar dados na tabela planoscor
app.post('/planoscor', (req, res) => {
  const { coordenador, date, nota, comentarios } = req.body;

  const SQL = 'INSERT INTO planoscor (coordenador, date, nota, comentarios) VALUES (?, ?, ?, ?)';
  const values = [coordenador, date, nota, comentarios];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

// Adicionando uma rota para salvar dados na tabela propostascor
app.post('/propostascor', (req, res) => {
  const { coordenador, date, comentarios } = req.body;

  const SQL = 'INSERT INTO propostascor (coordenador, date, comentarios) VALUES (?, ?, ?)';
  const values = [coordenador, date, comentarios];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).send({ error: err })
    }
    res.status(200).send({ message: 'Dados inseridos com sucesso!' })
  })
})

// Adicionando uma rota para buscar dados da tabela aula filtrados por unidade
app.get('/aula/:unidade', (req, res) => {
  const unidade = req.params.unidade;

  const SQL = 'SELECT * FROM aula WHERE LOWER(TRIM(unidade)) = ?';
  const valorNormalizado = unidade.trim().toLowerCase();

  db.query(SQL, [valorNormalizado], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados da aula:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});


app.get('/aula/detalhes/:unidade', (req, res) => {
  const { unidade } = req.params;
  const SQL = 'SELECT date, nota, regente, comentarios FROM aula WHERE unidade = ?';

  db.query(SQL, [unidade], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados completos:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

app.get('/diarios/detalhes/:unidade', (req, res) => {
  const { unidade } = req.params;
  const SQL = 'SELECT date, nota, regente, comentarios FROM diarios WHERE unidade = ?';

  db.query(SQL, [unidade], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados completos:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

app.get('/planos/detalhes/:unidade', (req, res) => {
  const { unidade } = req.params;
  const SQL = 'SELECT date, nota, regente, comentarios FROM planos WHERE unidade = ?';

  db.query(SQL, [unidade], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados completos:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

app.get('/fotosevideos/detalhes/:unidade', (req, res) => {
  const { unidade } = req.params;
  const SQL = 'SELECT date, nota, regente, comentarios FROM fotosevideos WHERE unidade = ?';

  db.query(SQL, [unidade], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados completos:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

app.get('/propostas/:unidade', (req, res) => {
  const { unidade } = req.params;
  const SQL = 'SELECT date, regente, comentarios FROM propostas WHERE unidade = ?';

  db.query(SQL, [unidade], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados completos:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

app.get('/propostas/detalhes/:unidade', (req, res) => {
  const { unidade } = req.params;
  const SQL = 'SELECT date, regente, comentarios FROM propostas WHERE unidade = ?';

  db.query(SQL, [unidade], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados completos:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

app.get('/inventario/:unidade', (req, res) => {
  const { unidade } = req.params;
  const SQL = 'SELECT date, regente, comentarios, quem, resolvido FROM inventario WHERE unidade = ?';

  db.query(SQL, [unidade], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados completos:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

app.get('/inventario/detalhes/:unidade', (req, res) => {
  const { unidade } = req.params;
  const SQL = 'SELECT date, regente, comentarios, quem, resolvido FROM inventario WHERE unidade = ?';

  db.query(SQL, [unidade], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados completos:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

app.get('/contato/detalhes/:unidade', (req, res) => {
  const { unidade } = req.params;
  const SQL = 'SELECT date, retorno, comentarios FROM contato WHERE unidade = ?';

  db.query(SQL, [unidade], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados completos:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

app.get('/contato/:unidade', (req, res) => {
  const { unidade } = req.params;
  const SQL = 'SELECT date, retorno, comentarios FROM contato WHERE unidade = ?';

  db.query(SQL, [unidade], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados completos:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

app.get('/guide/detalhes/:unidade', (req, res) => {
  const { unidade } = req.params;
  const SQL = 'SELECT date, turma, conformidade, comentarios FROM guide WHERE unidade = ?';

  db.query(SQL, [unidade], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados completos:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

app.get('/feira/detalhes/:unidade', (req, res) => {
  const { unidade } = req.params;
  const SQL = 'SELECT cronograma, estrutural, apresentacao, comentarios, date FROM feira WHERE unidade = ?';

  db.query(SQL, [unidade], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados completos:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

app.get('/feira/:unidade', (req, res) => {
  const { unidade } = req.params;
  const SQL = 'SELECT cronograma, estrutural, apresentacao, comentarios, date FROM feira WHERE unidade = ?';

  db.query(SQL, [unidade], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados completos:', err);
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
  const SQL = 'SELECT date, nota, regente, comentarios FROM diarios WHERE unidade = ?';
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
    SELECT date, cronograma, apresentacao, estrutural, comentarios
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

// Adicionando uma rota para buscar dados da tabela fotos e videos filtrados por unidade
app.get('/fotosevideos/:unidade', (req, res) => {
  const { unidade } = req.params;

  const SQL = 'SELECT date, nota, regente, comentarios FROM fotosevideos WHERE unidade = ?';
  const values = [unidade];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

// Adicionando uma rota para buscar dados da tabela guide filtrados por unidade
app.get('/guide/:unidade', (req, res) => {
  const { unidade } = req.params;

  const SQL = 'SELECT date, nota, regente, comentarios, conformidade FROM guide WHERE unidade = ?';
  const values = [unidade];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

// Adicionando uma rota para buscar dados da tabela planos filtrados por unidade
app.get('/planos/:unidade', (req, res) => {
  const { unidade } = req.params;

  const SQL = 'SELECT date, nota, regente, comentarios FROM planos WHERE unidade = ?';
  const values = [unidade];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

// Adicionando uma rota para buscar o role do usuário
app.get('/getRole/:email', (req, res) => {
  const { email } = req.params;

  const SQL = 'SELECT role FROM coordenadores WHERE email = ?';
  db.query(SQL, [email], (err, results) => {
    if (err) {
      console.error('Erro ao buscar o role:', err);
      return res.status(500).send({ error: err });
    }
    if (results.length > 0) {
      res.status(200).send({ role: results[0].role });
    } else {
      res.status(404).send({ message: 'Usuário não encontrado!' });
    }
  });
});

// Adicionando uma rota para buscar o nome do usuário
app.get('/getUsername/:email', (req, res) => {
  const { email } = req.params;

  const SQL = 'SELECT username FROM coordenadores WHERE email = ?';
  db.query(SQL, [email], (err, results) => {
    if (err) {
      console.error('Erro ao buscar o name:', err);
      return res.status(500).send({ error: err });
    }
    if (results.length > 0) {
      res.status(200).send({ name: results[0].username });
    } else {
      res.status(404).send({ message: 'Usuário não encontrado!' });
    }
  });
});

// Rota para buscar registros filtrados pelo coordenador
app.get('/:tabela/:coordenador', (req, res) => {
  const { tabela, coordenador } = req.params;

  // Evita SQL Injection
  const tabelasPermitidas = ["planoscor", "aulacor", "diarioscor", "fotosevideoscor", "propostascor", "contatocor", "guidecor", "feiracor"];

  if (!tabelasPermitidas.includes(tabela)) {
    return res.status(400).send({ error: "Tabela inválida!" });
  }

  const SQL = `SELECT * FROM ?? WHERE coordenador = ?`;

  db.query(SQL, [tabela, coordenador], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

// 🧹 Cron automático que remove sessões inativas a cada 2 minutos
setInterval(() => {
  const now = new Date();
  for (const [email, session] of activeSessions.entries()) {
    if (now - session.lastActive > SESSION_TIMEOUT_MS) {
      activeSessions.delete(email);
      console.log(`🕔 Sessão automaticamente expirada: ${email}`);
    }
  }
}, 2 * 60 * 1000); // A cada 2 minutos

// Rodando o servidor
app.listen(3002, () => {
  console.log('Server is running on port 3002');
});

// Rota para buscar as notas mais recentes por coordenador, filtradas por mês
app.get('/aulacor/notas-por-coordenador', (req, res) => {
  const { month } = req.query; // Captura o mês da query string
  const SQL = `
    SELECT coordenador, nota, comentarios 
    FROM aulacor 
    WHERE (date, coordenador) IN (
      SELECT MAX(date) AS date, coordenador 
      FROM aulacor 
      WHERE MONTH(date) = ?  -- Filtra pelo mês
      GROUP BY coordenador
    )
    ORDER BY coordenador ASC;
  `;

  db.query(SQL, [month], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

// Rota para o segundo gráfico, filtrada por mês
app.get('/contatocor/retornos-por-coordenador', (req, res) => {
  const { month } = req.query;
  const SQL = `
    SELECT coordenador, retorno 
    FROM contatocor 
    WHERE (date, coordenador) IN (
      SELECT MAX(date) AS date, coordenador 
      FROM contatocor 
      WHERE MONTH(date) = ?  -- Filtra pelo mês
      GROUP BY coordenador
    )
    ORDER BY coordenador ASC;
  `;

  db.query(SQL, [month], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados:', err);
      return res.status(500).send({ error: err });
    }
    res.status(200).send(results);
  });
});

// Rota para obter notas mais recentes por coordenador, filtradas por mês
app.get('/diarioscor/notas-por-coordenador', (req, res) => {
  const { month } = req.query;
  const query = `
    SELECT coordenador, nota, date, comentarios
    FROM diarioscor
    WHERE (coordenador, date) IN (
      SELECT coordenador, MAX(date)
      FROM diarioscor
      WHERE MONTH(date) = ?  -- Filtra pelo mês
      GROUP BY coordenador
    )
  `;
  db.query(query, [month], (err, results) => {
    if (err) {
      console.error("Erro ao buscar dados de notas por coordenador:", err);
      return res.status(500).json({ error: 'Erro ao buscar dados' });
    }
    res.json(results);
  });
});

app.get('/feiracor/notas-por-coordenador', (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: "O parâmetro 'month' é obrigatório." });
  }

  const query = `
    SELECT coordenador,
           SUM(CASE WHEN apresentacao = 'Sim' THEN 3 ELSE 0 END) +
           SUM(CASE WHEN estrutural = 'Sim' THEN 3 ELSE 0 END) +
           SUM(CASE WHEN cronograma = 'Sim' THEN 3 ELSE 0 END) +
           CASE WHEN apresentacao = 'Sim' AND estrutural = 'Sim' AND cronograma = 'Sim' THEN 1 ELSE 0 END AS nota
    FROM feiracor AS f
    WHERE f.date = (
      SELECT MAX(f2.date)
      FROM feiracor AS f2
      WHERE f2.coordenador = f.coordenador
        AND MONTH(f2.date) = ?
    )
    AND MONTH(f.date) = ?
    GROUP BY coordenador
  `;

  db.query(query, [month, month], (error, results) => {
    if (error) {
      console.error('Erro ao buscar dados de feiracor:', error);
      return res.status(500).json({ error: 'Erro ao buscar dados.' });
    }

    res.json(results);
  });
});

app.get('/fotosevideoscor/notas-por-coordenador', (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: "O parâmetro 'month' é obrigatório." });
  }

  const query = `
    SELECT coordenador, nota, comentarios
    FROM fotosevideoscor AS f
    WHERE f.date = (
      SELECT MAX(f2.date)
      FROM fotosevideoscor AS f2
      WHERE f2.coordenador = f.coordenador
        AND MONTH(f2.date) = ?
    )
    AND MONTH(f.date) = ?
    GROUP BY coordenador, nota
  `;

  db.query(query, [month, month], (error, results) => {
    if (error) {
      console.error('Erro ao buscar dados de fotosevideoscor:', error);
      return res.status(500).json({ error: 'Erro ao buscar dados.' });
    }

    res.json(results);
  });
});

app.put('/unidades/:cidade', (req, res) => {
  const { cidade } = req.params;
  const { endereco, telefone, coordenador, nomedir } = req.body; // Adicionado nomedir

  const query = `UPDATE unidades SET endereco = ?, telefone = ?, coordenador = ?, nomedir = ? WHERE cidade = ?`;
  const values = [endereco, telefone, coordenador, nomedir, cidade]; // Incluindo nomedir nos valores

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Erro ao atualizar a unidade:', err);
      return res.status(500).send('Erro ao atualizar a unidade');
    }
    if (results.affectedRows > 0) {
      res.send({ message: 'Unidade atualizada com sucesso' });
    } else {
      res.status(404).send({ message: 'Unidade não encontrada' });
    }
  });
});




// Login
app.post('/login', (req, res) => {
  const loginEmail = req.body.LoginEmail;
  const loginPassword = req.body.LoginPassword;

  console.log('Login Email:', loginEmail);
  console.log('Login Password:', loginPassword);

  const SQL = 'SELECT * FROM coordenadores WHERE email = ? AND password = ?';
  db.query(SQL, [loginEmail, loginPassword], (err, results) => {
    if (err) return res.status(500).send({ error: err });
    if (results.length === 0) return res.status(401).send({ message: 'Credenciais não encontradas!' });

    const now = new Date();

    // 🧹 Remove sessões inativas
    for (const [email, session] of activeSessions.entries()) {
      if (now - session.lastActive > SESSION_TIMEOUT_MS) {
        activeSessions.delete(email);
        console.log(`🕓 Sessão expirada: ${email}`);
      }
    }

    // 🚫 Remove a sessão mais antiga se passar do limite
    if (activeSessions.size >= MAX_USERS) {
      const oldest = [...activeSessions.entries()].sort((a, b) => a[1].loginTime - b[1].loginTime)[0];
      if (oldest) {
        activeSessions.delete(oldest[0]);
        console.log(`🔁 Sessão removida por excesso: ${oldest[0]}`);
      }
    }

    // ✅ Adiciona nova sessão
    activeSessions.set(loginEmail, {
      loginTime: now,
      lastActive: now
    });

    return res.status(200).send(results);
  });
});

// 🔁 Atualiza a última atividade do usuário
app.put('/atualizar-atividade/:email', (req, res) => {
  const { email } = req.params;
  if (activeSessions.has(email)) {
    activeSessions.get(email).lastActive = new Date();
    return res.status(200).send({ message: 'Atividade atualizada' });
  } else {
    return res.status(401).send({ message: 'Sessão não encontrada ou expirada' });
  }
});
