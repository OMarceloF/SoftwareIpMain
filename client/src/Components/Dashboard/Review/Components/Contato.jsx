import React, { useState, useEffect } from 'react';
import '../../../../App.css';
import './Contato.css';
import axios from 'axios';

const Aulas = () => {
    const [unit, setUnit] = useState('');
    const [textQuestion2, setTextQuestion2] = useState('');
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
                <label>Retorno?</label>
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
