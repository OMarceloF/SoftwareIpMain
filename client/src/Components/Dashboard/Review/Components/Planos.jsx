import React, { useState } from 'react';
import '../../../../App.css';
import './Planos.css';

const Aulas = () => {
  const [unit, setUnit] = useState('');
  const [rating, setRating] = useState(0);
  const [textQuestion1, setTextQuestion1] = useState('');
  const [textQuestion2, setTextQuestion2] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você pode enviar os dados para o backend
    const formData = {
      unit,
      rating,
      textQuestion1,
      textQuestion2,
    };
    console.log(formData);
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
          <option value="unidade1">Unidade 1</option>
          <option value="unidade2">Unidade 2</option>
          {/* Adicione mais opções conforme necessário */}
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
  );
};

export default Aulas;
