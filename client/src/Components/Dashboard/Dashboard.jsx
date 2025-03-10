import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import "../../App.css";
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
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("Seja bem vindo");

  const handleClick = () => {
    window.location.reload();
  };

  useEffect(() => {
    const email = localStorage.getItem("emailStorage");

    if (email) {
      axios
        .get(
          `https://softwareipmain-production.up.railway.app/getRole/${email}`
        )
        .then((response) => {
          setRole(response.data.role);
        })
        .catch((error) => {
          console.error("Erro ao buscar o role:", error);
        });
    }

    if (email) {
      axios
        .get(
          `https://softwareipmain-production.up.railway.app/getUsername/${email}`
        )
        .then((response) => {
          const fullName = response.data.name;
          setName(fullName);

          // Pegando o primeiro nome e verificando a última letra
          const firstName = fullName.split(" ")[0];
          if (firstName.slice(-1).toLowerCase() === "a") {
            setGreeting("Seja bem vinda");
          } else {
            setGreeting("Seja bem vindo");
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar o name:", error);
        });
    }
  }, []);

  const renderMenuOptions = () => {
    switch (role) {
      case "dev":
        return (
          <>
            <div className="buttonLeft">
              <IoMdHome />
              <Link to="/dashboard">
                <span>Home</span>
              </Link>
            </div>
            <div className="buttonLeft">
              <MdRateReview />
              <Link to="/dashboard/review">
                <span>Review</span>
              </Link>
            </div>
            <div className="buttonLeft">
              <FaHistory />
              <Link to="/dashboard/historico">
                <span>Histórico</span>
              </Link>
            </div>
            <div className="buttonLeft">
              <RxDashboard />
              <Link to="/dashboard/dashboardEscolha">
                <span>Dashboard</span>
              </Link>
            </div>
            <div className="buttonLeft">
              <RiCommunityLine />
              <Link to="/dashboard/unidades">
                <span>Unidades</span>
              </Link>
            </div>
            <div className="buttonLeft">
              <IoMdExit />
              <Link to="/">
                <span>Sair</span>
              </Link>
            </div>
          </>
        );
      case "admin":
        return (
          <>
            <div className="buttonLeft">
              <IoMdHome />
              <Link to="/dashboard">
                <span>Home</span>
              </Link>
            </div>
            <div className="buttonLeft">
              <RxDashboard />
              <Link to="/dashboard/dashboardEscolha">
                <span>Dashboard</span>
              </Link>
            </div>
            <div className="buttonLeft">
              <RiCommunityLine />
              <Link to="/dashboard/unidades">
                <span>Unidades</span>
              </Link>
            </div>
            <div className="buttonLeft">
              <IoMdExit />
              <Link to="/">
                <span>Sair</span>
              </Link>
            </div>
          </>
        );
      case "user":
        return (
          <>
            <div className="buttonLeft">
              <IoMdHome />
              <Link to="/dashboard">
                <span>Home</span>
              </Link>
            </div>
            <div className="buttonLeft">
              <MdRateReview />
              <Link to="/dashboard/review">
                <span>Review</span>
              </Link>
            </div>
            <div className="buttonLeft">
              <FaHistory />
              <Link to="/dashboard/historico">
                <span>Histórico</span>
              </Link>
            </div>
            <div className="buttonLeft">
              <RiCommunityLine />
              <Link to="/dashboard/unidades">
                <span>Unidades</span>
              </Link>
            </div>
            <div className="buttonLeft">
              <IoMdExit />
              <Link to="/">
                <span>Sair</span>
              </Link>
            </div>
          </>
        );
      case "supervisor":
        return (
          <>
            <div className="buttonLeft">
              <IoMdHome />
              <Link to="/dashboard">
                <span>Home</span>
              </Link>
            </div>
            <div className="buttonLeft">
              <MdRateReview />
              <Link to="/dashboard/escolherCoordenador">
                <span>Review</span>
              </Link>
            </div>
            <div className="buttonLeft">
              <FaHistory />
              <Link to="/dashboard/escolherCoordenadorCor">
                <span>Histórico</span>
              </Link>
            </div>
            <div className="buttonLeft">
              <FaHistory />
              <Link to="/dashboard/escolherCoordenadorHistorico">
                <span>Coordenadores</span>
              </Link>
            </div>
            <div className="buttonLeft">
              <IoMdExit />
              <Link to="/">
                <span>Sair</span>
              </Link>
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
          <img
            src={logo}
            alt="logo"
            onClick={handleClick}
            style={{ cursor: "pointer" }}
          />
        </div>
        {renderMenuOptions()}
      </div>
      <div className="content">
        {location.pathname === "/dashboard" ? (
          <>
            <h2>
              {greeting}, {name}!
            </h2>
            <video src={video} autoPlay muted loop></video>
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
