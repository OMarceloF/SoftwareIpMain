import './Unidades.css';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Unidades = () => {
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

    return (
        <>
            <h1>Unidades</h1>
            <div className="cards-container">
                {unidades.map((unidade, index) => (
                    <div key={index} className="card">
                        <h2>{unidade.cidade}</h2>
                        <p>{unidade.coordenador}</p>
                        <button>Veja sobre</button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Unidades;
