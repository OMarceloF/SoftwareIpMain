import React, { useState, useEffect } from 'react';
import '../../../../App.css';
import './Feira.css';
import axios from 'axios';

const Feira = () => {
    const [unit, setUnit] = useState('');
    const [textQuestion1, setTextQuestion1] = useState('');
    const [textQuestion2, setTextQuestion2] = useState('');
    const [textQuestion3, setTextQuestion3] = useState('');
    const [textQuestion4, setTextQuestion4] = useState('');
    const [yesNoQuestion, setYesNoQuestion] = useState('');
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

        // Validação para garantir que todos os campos necessários estão preenchidos
        if (!unit || !textQuestion1 || !textQuestion2 || !textQuestion3 || !textQuestion4) {
            setErrorMessage('Por favor, preencha todos os campos antes de enviar.');
            setTimeout(() => {
                setErrorMessage('');
            }, 4000);
            return;
        }

        setErrorMessage(''); // Clear error message if all fields are filled

        // Aqui você pode enviar os dados para o backend
        const formData = {
            unit,
            textQuestion1,
            textQuestion2,
            textQuestion3,
            textQuestion4,
            yesNoQuestion
        };
        
        axios.post('http://localhost:3002/inventario', formData)
            .then(response => {
                console.log('Dados enviados com sucesso:', response.data);
            })
            .catch(error => {
                console.error('Erro ao enviar dados:', error);
            });
    };

    return (
        <>
            <h2>Acompanhamento de Feiras</h2>
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
                    <label htmlFor="textQuestion1">Cronograma</label>
                    <input
                        type="text"
                        id="textQuestion1"
                        value={textQuestion1}
                        onChange={(e) => setTextQuestion1(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="textQuestion2">Estrutural</label>
                    <input
                        type="text"
                        id="textQuestion2"
                        value={textQuestion2}
                        onChange={(e) => setTextQuestion2(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="textQuestion3">Apresentação</label>
                    <input
                        type="text"
                        id="textQuestion3"
                        value={textQuestion3}
                        onChange={(e) => setTextQuestion3(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="textQuestion4">Observações</label>
                    <input
                        type="text"
                        id="textQuestion4"
                        value={textQuestion4}
                        onChange={(e) => setTextQuestion4(e.target.value)}
                    />
                </div>

                <button type="submit">Enviar</button>
            </form>
        </>
    );
};

export default Feira;
