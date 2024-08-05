import React, { useState } from 'react';
import './GuideCor.css';
import axios from 'axios';

const GuideCor = () => {
  const [textQuestion3, setTextQuestion3] = useState('');
  const [yesNoQuestion, setYesNoQuestion] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validação para garantir que todos os campos necessários estão preenchidos
    if (!yesNoQuestion || !textQuestion3) {
      setErrorMessage('Por favor, preencha todos os campos antes de enviar.');
      setTimeout(() => {
        setErrorMessage('');
      }, 4000);
      return;
    }

    setErrorMessage(''); // Clear error message if all fields are filled

    const currentDate = new Date().toISOString().split('T')[0];
    const formData = {
      coordenador: localStorage.getItem('coordenadorStorage'),
      date: currentDate,
      conformidade: yesNoQuestion,
      comentarios: textQuestion3,
    };

    axios.post('http://localhost:3002/guideCor', formData)
      .then(response => {
        console.log('Dados enviados com sucesso:', response.data);
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  };

  return (
    <>
      <h2>Avaliação de Conformidade com o Teachers Guide</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
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

export default GuideCor;
