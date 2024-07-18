import React, { useState, useEffect } from 'react';
import '../../../../App.css';
import './Propostas.css';
import axios from 'axios';

const Aulas = () => {
  const [unit, setUnit] = useState('');
  const [textQuestion1, setTextQuestion1] = useState('');
  const [textQuestion2, setTextQuestion2] = useState('');
  const [unidades, setUnidades] = useState([]);

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
    // Aqui você pode enviar os dados para o backend
    const currentDate = new Date().toISOString().split('T')[0];
    const formData = {
      date: currentDate,
      unidade: unit,
      regente: textQuestion1,
      comentarios: textQuestion2,
    };

    axios.post('http://localhost:3002/propostas', formData).then(response => {
      console.log('Dados enviados com sucesso:', response.data);
    })

};

return (
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

    <button type="submit">Enviar</button>
  </form>
);
};

export default Aulas;
