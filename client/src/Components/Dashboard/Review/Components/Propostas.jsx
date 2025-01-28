import React, { useState, useEffect } from 'react';
import '../../../../App.css';
import './Propostas.css';
import axios from 'axios';

const Aulas = () => {
  const [unit, setUnit] = useState('');
  const [textQuestion1, setTextQuestion1] = useState('');
  const [textQuestion2, setTextQuestion2] = useState('');
  const [unidades, setUnidades] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Verificar se todos os campos estão preenchidos
    if (!unit || !textQuestion1 || !textQuestion2) {
      setError('Por favor, preencha todos os campos.');
      setIsSubmitting(false);
      setTimeout(() => {
        setError('');
      }, 4000);
      return;
    }

    setIsSubmitting(true);
    const currentDate = new Date().toISOString().split('T')[0];
    const formData = {
      date: currentDate,
      unidade: unit,
      regente: textQuestion1,
      comentarios: textQuestion2,
    };

    axios.post('http://localhost:3002/propostas', formData)
      .then(response => {
        console.log('Dados enviados com sucesso:', response.data);
        setError('');
        setIsSubmitting(false);
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <h2>Propostas de Aulas e Projetos de Destaque</h2>
      {error && <p className="error-message">{error}</p>}
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
          <label htmlFor="textQuestion1">Regente</label>
          <input
            type="text"
            id="textQuestion1"
            value={textQuestion1}
            onChange={(e) => setTextQuestion1(e.target.value)}
          />
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

        <button type="submit" disabled={isSubmitting}>Enviar</button>
      </form>
    </>
  );
};

export default Aulas;
