import React from "react";
import '../../../App.css';
import './ReviewCoordenadores.css';
import { useLocation, Outlet, Link } from "react-router-dom";

// IconeLink
import { TfiLayoutMediaRightAlt } from "react-icons/tfi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { RiPagesLine } from "react-icons/ri";
import { FaPhotoVideo } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa6";
import { IoIosContact } from "react-icons/io";
import { GiTeacher } from "react-icons/gi";
import { GiLaserSparks } from "react-icons/gi";


const ReviewCoordenadores = () => {

  const location = useLocation();

  return (
    <div className="review">

      <div className="content">
        {location.pathname === "/dashboard/escolherCoordenador/reviewCoordenadores" ? (
          <>
            <h2>Acompanhamento Semanal</h2>
            <div className="left">
              {/*<Link to="/dashboard/escolherCoordenador/reviewCoordenadores/planosDeAulaCor" className="buttonLeft">
                <TfiLayoutMediaRightAlt />
                <span>Plano de Aula</span>
              </Link>*/}

              <Link to="/dashboard/escolherCoordenador/reviewCoordenadores/aulaCor" className="buttonLeft">
                <FaChalkboardTeacher />
                <span>Aula</span>
              </Link>

              <Link to="/dashboard/escolherCoordenador/reviewCoordenadores/diariosCor" className="buttonLeft">
                <RiPagesLine />
                <span>Diário</span>
              </Link>

              <Link to="/dashboard/escolherCoordenador/reviewCoordenadores/fotosEVideosCor" className="buttonLeft">
                <FaPhotoVideo />
                <span>Fotos e Vídeos</span>
              </Link>

              <Link to="/dashboard/escolherCoordenador/reviewCoordenadores/propostasCor" className="buttonLeft">
                <FaHandshake />
                <span>Propostas</span>
              </Link>

              <Link to="/dashboard/escolherCoordenador/reviewCoordenadores/contatoCor" className="buttonLeft">
                <IoIosContact />
                <span>Contato</span>
              </Link>

              {/*<Link to="/dashboard/escolherCoordenador/reviewCoordenadores/guideCor" className="buttonLeft">
                <GiTeacher />
                <span>Guide</span>
              </Link>*/}

              <Link to="/dashboard/escolherCoordenador/reviewCoordenadores/FeiraCor" className="buttonLeft">
                <GiLaserSparks />
                <span>Feira</span>
              </Link>
            </div>

          </>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  )
}

export default ReviewCoordenadores;