import React, { useState, useEffect } from 'react';
import '../../../../App.css';
import './Inventario.css';
import axios from 'axios';

const Aulas = () => {
    const [unit, setUnit] = useState('');
    const [textQuestion1, setTextQuestion1] = useState('');
    const [textQuestion2, setTextQuestion2] = useState('');
    const [textQuestion3, setTextQuestion3] = useState('');
    const [textQuestion4, setTextQuestion4] = useState('');
    const [yesNoQuestion, setYesNoQuestion] = useState('');
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
        const formData = {
            unit,
            rating,
            textQuestion1,
            textQuestion2,
        };
        console.log(formData);
    };

    return (
        <>
            <h2>Acompanhamento de Feiras</h2>
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

                <div>
                    <label>Resolvido?</label>
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

                <button type="submit">Enviar</button>
            </form>
        </>
    );
};

export default Aulas;
