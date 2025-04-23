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
          //`http://localhost:3002/getRole/${email}`
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
          //`http://localhost:3002/getUsername/${email}`
        )
        .then((response) => {
          const fullName = response.data.name;
          setName(fullName);

          // Pegando o primeiro nome e verificando a última letra
          const nomesFemininosComuns = ["Aline", "Michele", "Rute", "Ester", "Viviane", "Luane", "gisele", "beatriz", "tamires"];
          const firstName = fullName.split(" ")[0];
          if (
            firstName.slice(-1) === "a" ||
            nomesFemininosComuns.includes(firstName)
          ) {
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
            <Link to="/dashboard/" className="buttonLeft full-link">
              <IoMdHome />
              <span>Home</span>
            </Link>
            <Link to="/dashboard/review" className="buttonLeft full-link">
              <MdRateReview />
              <span>Review</span>
            </Link>
            <Link to="/dashboard/historico" className="buttonLeft full-link">
              <FaHistory />
              <span>Histórico</span>
            </Link>
            <Link to="/dashboard/dashboardEscolha" className="buttonLeft full-link">
              <RxDashboard />
              <span>Dashboard</span>
            </Link>
            <Link to="/dashboard/unidades" className="buttonLeft full-link">
              <RiCommunityLine />
              <span>Unidades</span>
            </Link>
            <Link to="/" className="buttonLeft full-link">
              <IoMdExit />
              <span>Sair</span>
            </Link>
          </>
        );
      case "admin":
        return (
          <>
            <Link to="/dashboard/" className="buttonLeft full-link">
              <IoMdHome />
              <span>Home</span>
            </Link>
            <Link to="/dashboard/dashboardEscolha" className="buttonLeft full-link">
              <RxDashboard />
              <span>Dashboard</span>
            </Link>
            <Link to="/dashboard/unidades" className="buttonLeft full-link">
              <RiCommunityLine />
              <span>Unidades</span>
            </Link>
            <Link to="/" className="buttonLeft full-link">
              <IoMdExit />
              <span>Sair</span>
            </Link>
          </>
        );
      case "user":
        return (
          <>
            <Link to="/dashboard/" className="buttonLeft full-link">
              <IoMdHome />
              <span>Home</span>
            </Link>
            <Link to="/dashboard/review" className="buttonLeft full-link">
              <MdRateReview />
              <span>Review</span>
            </Link>
            <Link to="/dashboard/historico" className="buttonLeft full-link">
              <FaHistory />
              <span>Histórico</span>
            </Link>
            <Link to="/dashboard/unidades" className="buttonLeft full-link">
              <RiCommunityLine />
              <span>Unidades</span>
            </Link>
            <Link to="/" className="buttonLeft full-link">
              <IoMdExit />
              <span>Sair</span>
            </Link>
          </>
        );
      case "supervisor":
        return (
          <>
            <Link to="/dashboard/" className="buttonLeft full-link">
              <IoMdHome />
              <span>Home</span>
            </Link>
            <Link to="/dashboard/escolherCoordenador" className="buttonLeft full-link">
              <MdRateReview />
              <span>Review</span>
            </Link>
            <Link to="/dashboard/escolherCoordenadorCor" className="buttonLeft full-link">
              <FaHistory />
              <span>Histórico</span>
            </Link>
            <Link to="/dashboard/escolherCoordenadorHistorico" className="buttonLeft full-link">
              <FaHistory />
              <span>Coordenadores</span>
            </Link>
            <Link to="/" className="buttonLeft full-link">
              <IoMdExit />
              <span>Sair</span>
            </Link>
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
