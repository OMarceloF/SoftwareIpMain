import React, { useState, useEffect } from 'react';
import '../../../../App.css';
import './Propostas.css';
import axios from 'axios';

const Propostas = () => {
  const [unit, setUnit] = useState('');
  const [textQuestion1, setTextQuestion1] = useState('');
  const [textQuestion2, setTextQuestion2] = useState('');
  const [unidades, setUnidades] = useState([]);
  const [coordenador, setCoordenador] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtendo o email do usuário logado
  const email = localStorage.getItem('emailStorage');

  useEffect(() => {
    if (!email) {
      setError('Usuário não autenticado.');
      return;
    }

    // Buscar o nome do coordenador com base no email
    axios.get(`http://localhost:3002/getUsername/${email}`)
      .then(response => {
        const nomeCoordenador = response.data.name;
        setCoordenador(nomeCoordenador);

        // Buscar as unidades e filtrar apenas as que pertencem ao coordenador logado
        axios.get('http://localhost:3002/unidades')
          .then(response => {
            const unidadesFiltradas = response.data.filter(unidade => unidade.coordenador === nomeCoordenador);
            setUnidades(unidadesFiltradas);
          })
          .catch(error => {
            console.error('Erro ao buscar unidades:', error);
          });
      })
      .catch(error => {
        console.error('Erro ao obter coordenador:', error);
      });
  }, [email]);

  const handleSubmit = (event) => {
    event.preventDefault();

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
      .then(() => {
        setSuccessMessage('Dados enviados com sucesso!');
        setUnit('');
        setTextQuestion1('');
        setTextQuestion2('');
        setError('');
        setIsSubmitting(false);

        setTimeout(() => {
          setSuccessMessage('');
        }, 4000);
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
      {successMessage && <p className="success-message">{successMessage}</p>}
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

export default Propostas;
