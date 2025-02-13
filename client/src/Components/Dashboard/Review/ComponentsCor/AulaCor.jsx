import React, { useState } from 'react';
import './AulaCor.css';
import axios from 'axios';

const AulaCor = () => {
    const [rating, setRating] = useState(0);
    const [textQuestion2, setTextQuestion2] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Novo estado para mensagem de sucesso

    const handleSubmit = (event) => {
        event.preventDefault();
        const currentDate = new Date().toISOString().split('T')[0];

        if (!rating || !textQuestion2) {
            setErrorMessage('Por favor, preencha todos os campos antes de enviar.');
            setTimeout(() => {
                setErrorMessage('');
            }, 4000);
            return;
        }

        setErrorMessage(''); // Limpa a mensagem de erro

        const formData = {
            date: currentDate,
            nota: rating,
            comentarios: textQuestion2,
            coordenador: localStorage.getItem('coordenadorStorage'),
        };

        axios.post('https://softwareipmain-production.up.railway.app/aulacor', formData)
            .then(() => {
                // Exibe a mensagem de sucesso e reseta os campos
                setSuccessMessage('Dados enviados com sucesso!');
                setRating(0);
                setTextQuestion2('');

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
            <div className="title-form">
                <h2>Avaliação de Aulas Assistidas</h2>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
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

export default AulaCor;
