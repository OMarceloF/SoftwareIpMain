import React, { useState } from 'react';
import './PropostasCor.css';
import axios from 'axios';

const PropostasCor = () => {
  const [textQuestion2, setTextQuestion2] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Novo estado para mensagem de sucesso
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Verificar se todos os campos estão preenchidos
    if (!textQuestion2) {
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
      coordenador: localStorage.getItem('coordenadorStorage'),
      date: currentDate,
      comentarios: textQuestion2,
    };

    axios.post('http://localhost:3002/propostasCor', formData)
      .then(() => {
        // Exibe a mensagem de sucesso e reseta os campos
        setSuccessMessage('Dados enviados com sucesso!');
        setTextQuestion2('');
        setIsSubmitting(false);

        // Remove a mensagem após 4 segundos
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

export default PropostasCor;
