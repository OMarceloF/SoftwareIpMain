import React, { useState, useEffect } from 'react';
import '../../../../App.css';
import './Guide.css';
import axios from 'axios';

const Guide = () => {
  const [unit, setUnit] = useState('');
  const [textQuestion3, setTextQuestion3] = useState('');
  const [yesNoQuestion, setYesNoQuestion] = useState('');
  const [unidades, setUnidades] = useState([]);
  const [turmaQuestion, setturmaQuestion] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Novo estado para mensagem de sucesso

  useEffect(() => {
    axios.get('http://localhost:3002/unidades')
      .then(response => {
        setUnidades(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validação para garantir que todos os campos necessários estão preenchidos
    if (!unit || turmaQuestion === '' || !yesNoQuestion || !textQuestion3) {
      setErrorMessage('Por favor, preencha todos os campos antes de enviar.');
      setTimeout(() => {
        setErrorMessage('');
      }, 4000);
      return;
    }

    setErrorMessage(''); // Limpa a mensagem de erro

    const currentDate = new Date().toISOString().split('T')[0];
    const formData = {
      date: currentDate,
      unidade: unit,
      turma: turmaQuestion,
      conformidade: yesNoQuestion,
      comentarios: textQuestion3,
    };

    axios.post('http://localhost:3002/guide', formData)
      .then(() => {
        // Exibe a mensagem de sucesso e reseta os campos
        setSuccessMessage('Dados enviados com sucesso!');
        setUnit('');
        setturmaQuestion('');
        setYesNoQuestion('');
        setTextQuestion3('');

        // Remove a mensagem após 4 segundos
        setTimeout(() => {
          setSuccessMessage('');
        }, 4000);
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  };

  return (
    <>
      <h2>Avaliação de Conformidade com o Teachers Guide</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="unit">Unidade:</label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="">Selecione uma unidade</option>
            {unidades.map((unidade, index) => (
              <option key={index} value={unidade.cidade}>{unidade.cidade}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="turmaQuestion">Turma:</label>
          <input
            type="number"
            id="turmaQuestion"
            value={turmaQuestion}
            onChange={(e) => setturmaQuestion(e.target.value)}
          />
        </div>

        <div>
          <label>Conformidade com o Teachers Guide?</label>
          <div className='inputsGuide'>
            <label>
              <input
                type="radio"
                value="Sim"
                checked={yesNoQuestion === 'Sim'}
                onChange={(e) => setYesNoQuestion(e.target.value)}
              />
              Sim
            </label>
            <label>
              <input
                type="radio"
                value="Não"
                checked={yesNoQuestion === 'Não'}
                onChange={(e) => setYesNoQuestion(e.target.value)}
              />
              Não
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="textQuestion3">Observações:</label>
          <input
            type="text"
            id="textQuestion3"
            value={textQuestion3}
            onChange={(e) => setTextQuestion3(e.target.value)}
          />
        </div>

        <button type="submit">Enviar</button>
      </form>
    </>
  );
};

export default Guide;
