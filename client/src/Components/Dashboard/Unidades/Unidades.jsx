import './Unidades.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Outlet, Link } from "react-router-dom";

const Unidades = () => {
    const location = useLocation();

    const [unidades, setUnidades] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3002/unidades')
            .then(response => {
                // Ordena as unidades em ordem alfabética com base no nome da cidade
                const sortedUnidades = response.data.sort((a, b) => a.cidade.localeCompare(b.cidade));
                setUnidades(sortedUnidades);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
    }, []);

    // Filtra as unidades conforme o termo de pesquisa
    const filteredUnidades = unidades.filter(unidade =>
        unidade.cidade.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    return (
        <>
            {location.pathname === "/dashboard/unidades" ? (
                <>
                    <h2>Unidades</h2>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar unidade..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                    <div className="list-container">
                        {filteredUnidades.map((unidade, index) => (
                            <div key={index} className="list-item">
                                <span>{unidade.cidade}</span>
                                <Link to={`/dashboard/unidades/editar/${unidade.id}`}>
                                    <button className="edit-button">Editar</button>
                                </Link>
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
