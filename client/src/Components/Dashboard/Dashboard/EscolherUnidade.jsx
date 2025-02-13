import React, { useState, useEffect } from 'react';
import './EscolherUnidade.css';
import axios from 'axios';
import { useLocation, Outlet, Link } from "react-router-dom";

const Aulas = () => {
    const [unit, setUnit] = useState('');
    const [unidades, setUnidades] = useState([]);
    const location = useLocation();

    useEffect(() => {
        axios.get('https://softwareipmain-production.up.railway.app/unidades')
            .then(response => {
                setUnidades(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
    }, []);

    const LocalStorageFunction = () => {
        localStorage.setItem('unidadeStorage', unit);
    }

    return (
        <div>
            {location.pathname === "/dashboard/dashboardEscolha/escolherUnidade" ? (
                <>
                    <div className="title-form">
                        <h2>Avaliação das unidades</h2>
                    </div>
                    <form>
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

                        <Link to="/dashboard/dashboardEscolha/escolherUnidade/dashboardGraph"><button type="submit" onClick={LocalStorageFunction()}>Enviar</button></Link>
                    </form>
                </>
            ) : (
                <Outlet />
            )}
        </div>
    );
};

export default Aulas;
