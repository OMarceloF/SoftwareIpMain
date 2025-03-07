import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, Outlet, Link } from "react-router-dom";

const EscolherCoordenadorHistorico = () => {
    const [coordenador, setCoordenador] = useState('');
    const [coordenadores, setCoordenadores] = useState([]);
    const location = useLocation();

    useEffect(() => {
        axios.get('https://softwareipmain-production.up.railway.app/coordenadores')
            .then(response => {
                setCoordenadores(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
    }, []);

    const LocalStorageFunction = () => {
        localStorage.setItem('coordenadorStorage', coordenador);
    }

    return (
        <div>
            {location.pathname === "/dashboard/escolherCoordenadorHistorico" ? (
                <>
                    <div className="title-form">
                        <h2>Escolha o Coordenador</h2>
                    </div>
                    <form>
                        <div>
                            <label htmlFor="coordenador">Coordenador:</label>
                            <select
                                id="coordenador"
                                value={coordenador}
                                onChange={(e) => setCoordenador(e.target.value)}
                            >
                                <option value="">Selecione um Coordenador</option>
                                {coordenadores.map((coordenadores, index) => (
                                    <option key={index} value={coordenadores.username}>{coordenadores.username}</option>
                                ))}
                            </select>
                        </div>

                        <Link to="/dashboard/escolherCoordenadorHistorico/historicoCoordenadores"><button type="submit" onClick={LocalStorageFunction()}>Avaliar</button></Link>
                    </form>
                </>
            ) : (
                <Outlet />
            )}
        </div>
    );
};

export default EscolherCoordenadorHistorico;
