import React, { useState, useEffect } from 'react';
import '../../../../App.css';
import './Diario.css';
import axios from 'axios';

const Diario = () => {
    const [unit, setUnit] = useState('');
    const [rating, setRating] = useState(0);
    const [textQuestion1, setTextQuestion1] = useState('');
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
        const currentDate = new Date().toISOString().split('T')[0];

        if (!unit || !rating || !textQuestion1 || !textQuestion2) {
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
            unidade: unit,
            regente: textQuestion1,
            nota: rating,
            comentarios: textQuestion2,
        };

        axios.post('http://localhost:3002/diarios', formData)
            .then(response => {
                console.log('Dados enviados com sucesso:', response.data);
            })
            .catch(error => {
                console.error('Erro ao enviar dados:', error);
            });
    };

    return (
        <>
            <h2>Conferencia e Avaliação de Diário</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
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
        </>
    );
};

export default Diario;
