import React, { useState } from 'react';
import '../../../../App.css';
import './PlanosDeAulaCor.css';
import axios from 'axios';

const PlanosDeAulaCor = () => {
    const [rating, setRating] = useState(0);
    const [textQuestion2, setTextQuestion2] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validação para garantir que todos os campos necessários estão preenchidos
        if ( !textQuestion2 || rating === null) {
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
            nota: rating,
            comentarios: textQuestion2,
        };

        axios.post('http://localhost:3002/planosCor', formData)
            .then(response => {
                console.log('Dados enviados com sucesso:', response.data);
            })
            .catch(error => {
                console.error('Erro ao enviar dados:', error);
            });
    };

    return (
        <>
            <h2>Avaliação de Planos de Aulas</h2>
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
                    <label htmlFor="textQuestion2">Observações:</label>
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

export default PlanosDeAulaCor;
