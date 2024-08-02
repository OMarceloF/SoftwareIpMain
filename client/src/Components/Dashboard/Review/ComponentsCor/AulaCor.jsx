import React, { useState } from 'react';
import './AulaCor.css';
import axios from 'axios';

const AulaCor = () => {
    const [rating, setRating] = useState(0);
    const [textQuestion2, setTextQuestion2] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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

        setErrorMessage(''); // Clear error message if all fields are filled

        // Aqui você pode enviar os dados para o backend
        const formData = {
            date: currentDate,
            nota: rating,
            comentarios: textQuestion2,
            coordenador: localStorage.getItem('coordenadorStorage'),
        };

        axios.post('http://localhost:3002/aulacor', formData).then(response => {
            console.log('Dados enviados com sucesso:', response.data);
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
