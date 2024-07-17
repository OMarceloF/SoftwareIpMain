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
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {unidades.map((unidade, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', margin: '8px', width: '200px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <h2>{unidade.cidade}</h2>
                        <p>{unidade.coordenador}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Unidades;
