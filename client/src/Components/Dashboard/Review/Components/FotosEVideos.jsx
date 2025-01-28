import React, { useState, useEffect } from 'react';
import '../../../../App.css';
import './FotosEVideos.css';
import axios from 'axios';

const FotosEVideos = () => {
  const [unit, setUnit] = useState('');
  const [rating, setRating] = useState(0);
  const [textQuestion2, setTextQuestion2] = useState('');
  const [unidades, setUnidades] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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
    if (!unit || rating === null || !textQuestion2) {
      setErrorMessage('Por favor, preencha todos os campos antes de enviar.');
      setTimeout(() => {
        setErrorMessage('');
      }, 4000);
      return;
    }

    setErrorMessage(''); // Clear error message if all fields are filled

    const currentDate = new Date().toISOString().split('T')[0];
    const formData = {
      date: currentDate,
      unidade: unit,
      nota: rating,
      comentarios: textQuestion2,
    };

    axios.post('http://localhost:3002/fotosevideos', formData)
      .then(response => {
        console.log('Dados enviados com sucesso:', response.data);
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  };

  return (
    <>
      <h2>Avaliação de Registro de Aulas</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className='unidadeDiv'>
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
          <label>Nota:</label>
          <div className='escolhaQuestion'>
            {[...Array(11).keys()].map((number) => (
              <label key={number}>
                <input
                  type="radio"
                  value={number}
                  checked={rating === number}
                  onChange={(e) => setRating(Number(e.target.value))}
                />
                {number}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="textQuestion2">Observações</label>
          <input
            type="text"
            id="textQuestion2"
            value={textQuestion2}
            onChange={(e) => setTextQuestion2(e.target.value)}
          />
        </div>

        <button type="submit">Enviar</button>
      </form>
    </>
  );
};

export default FotosEVideos;
