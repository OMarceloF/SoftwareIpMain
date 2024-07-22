import React, { useState } from 'react';
import axios from 'axios';
import './CriarUnidades.css';

const Aulas = () => {
    const [textQuestion1, setTextQuestion1] = useState('');
    const [textQuestion2, setTextQuestion2] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aqui você pode enviar os dados para o backend
        const formData = {
            cidade: textQuestion1,
            coordenador: textQuestion2,
        }

        axios.post('http://localhost:3002/unidades', formData).then(response => {
            console.log('Dados enviados com sucesso:', response.data);
        })

    };

    return (
        <>
            <h2>Adicione uma unidade</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="textQuestion1">Cidade</label>
                    <input
                        type="text"
                        id="textQuestion1"
                        value={textQuestion1}
                        onChange={(e) => setTextQuestion1(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="textQuestion2">Coordenador</label>
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

export default Aulas;
