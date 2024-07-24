import './Unidades.css';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Outlet, Link } from "react-router-dom";

const Unidades = () => {
    const location = useLocation();

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
            {location.pathname === "/dashboard/unidades" ? (
                <>
                    <h2>Unidades</h2>
                    <div className="cards-container">
                        {unidades.map((unidade, index) => (
                            <div key={index} className="card">
                                <h2>{unidade.cidade}</h2>
                            </div>
                        ))}
                    </div>
                    <Link to="/dashboard/unidades/criarunidade"><button>Adicionar Nova Unidade</button></Link>
                </>
            ) : (
                <Outlet />
            )}
        </>
    );
};

export default Unidades;
