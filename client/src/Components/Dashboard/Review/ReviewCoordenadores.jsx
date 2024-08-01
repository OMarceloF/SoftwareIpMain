import React from "react";
import '../../../App.css';
import './Review.css';
import { useLocation, Outlet, Link } from "react-router-dom";

// IconeLink
import { TfiLayoutMediaRightAlt } from "react-icons/tfi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { RiPagesLine } from "react-icons/ri";
import { FaPhotoVideo } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa6";
import { MdInventory } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import { GiTeacher } from "react-icons/gi";
import { GiLaserSparks } from "react-icons/gi";



const ReviewCoordenadores = () => {

  const location = useLocation();

  return (
    <div className="review">

      <div className="content">
        {location.pathname === "/dashboard/reviewCoordenadores" ? (
          <>
            <h2>Acompanhamento Semanal</h2>
            <div className="left">
              <div className="buttonLeft">
                <TfiLayoutMediaRightAlt />
                <Link to="/dashboard/review/planosDeAulaCor"><span>Plano de Aula</span></Link>
              </div>
              <div className="buttonLeft">
                <FaChalkboardTeacher />
                <Link to="/dashboard/review/aulasCor"><span>Aula</span></Link>
              </div>
              <div className="buttonLeft">
                <RiPagesLine />
                <Link to="/dashboard/review/diarioCor"><span>Diário</span></Link>
              </div>
              <div className="buttonLeft">
                <FaPhotoVideo />
                <Link to="/dashboard/review/fotosEVideosCor"><span>Fotos e Vídeos</span></Link>
              </div>
              <div className="buttonLeft">
                <FaHandshake />
                <Link to="/dashboard/review/propostasCor"><span>Propostas</span></Link>
              </div>
              <div className="buttonLeft">
                <MdInventory />
                <Link to="/dashboard/review/inventarioCor"><span>Inventário</span></Link>
              </div>
              <div className="buttonLeft">
                <IoIosContact />
                <Link to="/dashboard/review/contatoCor"><span>Contato</span></Link>
              </div>
              <div className="buttonLeft">
                <GiTeacher />
                <Link to="/dashboard/review/guideCor"><span>Guide</span></Link>
              </div>
              <div className="buttonLeft">
                <GiLaserSparks />
                <Link to="/dashboard/review/feiraCor"><span>Feira</span></Link>
              </div>

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