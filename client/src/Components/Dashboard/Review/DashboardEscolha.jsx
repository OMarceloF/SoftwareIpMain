import React from 'react';
import './DashboardEscolha.css';
import { Link, Outlet, useLocation } from "react-router-dom";

import { TbBuildingStore } from "react-icons/tb";
import { IoIosPerson } from "react-icons/io";

const App = () => {
    const location = useLocation();

    return (
        <div className="container">
            {location.pathname === "/dashboard/dashboardEscolha" ? (
                <>
                    <Link to={"/dashboard/dashboardEscolha/escolherUnidade"}><div className="card">
                        <div className="icon-container">
                            <TbBuildingStore size={64} />
                        </div>
                        <h3>Unidades</h3>
                        <p>Veja o desempenho das Unidades</p>
                    </div></Link>
                    <div className="card">
                        <div className="icon-container">
                            <IoIosPerson size={64} />
                        </div>
                        <h3>Coordenadores</h3>
                        <Link to={"/dashboard/dashboardEscolha/dashboardGraphCor"}><p>Veja o desempenho dos coordenadores</p></Link>
                    </div>
                </>
            ) : (
                <Outlet />
            )}
        </div>
    );
};

export default App;
