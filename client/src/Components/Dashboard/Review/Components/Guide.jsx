import React, { useState } from 'react';
import '../../../../App.css';
import './Guide.css';

const Aulas = () => {
  const [unit, setUnit] = useState('');
  const [textQuestion3, setTextQuestion3] = useState('');
  const [yesNoQuestion, setYesNoQuestion] = useState(''); 

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
        <label>Conformidade com o Teachers Guide?</label>
        <div>
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
  );
};

export default Aulas;
