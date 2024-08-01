import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import '../../App.css';
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaHistory } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { IoMdHome } from "react-icons/io";
import { RiCommunityLine } from "react-icons/ri";
import { IoMdExit } from "react-icons/io";
import logo from "../../LoginAssets/logoIPSemFundo.png";
import video from "../../LoginAssets/videoFundo.mp4";

const Dashboard = () => {
  const location = useLocation();
  const [role, setRole] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('emailStorage');

    if (email) {
      axios.get(`http://localhost:3002/getRole/${email}`)
        .then(response => {
          setRole(response.data.role);
        })
        .catch(error => {
          console.error('Erro ao buscar o role:', error);
        });
    }

    if (email) {
      axios.get(`http://localhost:3002/getUsername/${email}`)
        .then(response => {
          setName(response.data.name);
        })
        .catch(error => {
          console.error('Erro ao buscar o name:', error);
        });
    }
  }, []);

  const renderMenuOptions = () => {
    switch (role) {
      case 'dev':
        return (
          <>
            <div className="buttonLeft">
              <IoMdHome />
              <Link to="/dashboard"><span>Home</span></Link>
            </div>
            <div className="buttonLeft">
              <MdRateReview />
              <Link to="/dashboard/review"><span>Review</span></Link>
            </div>
            <div className="buttonLeft">
              <FaHistory />
              <a href="#"><span>Histórico</span></a>
            </div>
            <div className="buttonLeft">
              <RxDashboard />
              <Link to="/dashboard/escolherUnidade"><span>Dashboard</span></Link>
            </div>
            <div className="buttonLeft">
              <RiCommunityLine />
              <Link to="/dashboard/unidades"><span>Unidades</span></Link>
            </div>
            <div className="buttonLeft">
              <IoMdExit />
              <Link to="/"><span>Sair</span></Link>
            </div>
          </>
        );
      case 'admin':
        return (
          <>
            <div className="buttonLeft">
              <IoMdHome />
              <Link to="/dashboard"><span>Home</span></Link>
            </div>
            <div className="buttonLeft">
              <RxDashboard />
              <Link to="/dashboard/escolherUnidade"><span>Dashboard</span></Link>
            </div>
            <div className="buttonLeft">
              <RiCommunityLine />
              <Link to="/dashboard/unidades"><span>Unidades</span></Link>
            </div>
            <div className="buttonLeft">
              <IoMdExit />
              <Link to="/"><span>Sair</span></Link>
            </div>
          </>
        );
      case 'user':
        return (
          <>
            <div className="buttonLeft">
              <IoMdHome />
              <Link to="/dashboard"><span>Home</span></Link>
            </div>
            <div className="buttonLeft">
              <MdRateReview />
              <Link to="/dashboard/review"><span>Review</span></Link>
            </div>
            <div className="buttonLeft">
              <FaHistory />
              <a href="#"><span>Histórico</span></a>
            </div>
            <div className="buttonLeft">
              <RiCommunityLine />
              <Link to="/dashboard/unidades"><span>Unidades</span></Link>
            </div>
            <div className="buttonLeft">
              <IoMdExit />
              <Link to="/"><span>Sair</span></Link>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="homepage">
      <div className="left">
        <div className="logoPage">
          <img src={logo} alt="logo" />
        </div>
        {renderMenuOptions()}
      </div>
      <div className="content">
        {location.pathname === "/dashboard" ? (
          <>
            <h2>Bem vindo, {name}!</h2>
            <video src={video} autoPlay muted loop></video>
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
