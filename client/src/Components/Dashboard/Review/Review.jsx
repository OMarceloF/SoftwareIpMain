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



const Review = () => {

  const location = useLocation();

  return (
    <div className="review">

      <div className="content">
        {location.pathname === "/dashboard/review" ? (
          <>
            <h2>Faça sua Avaliação</h2>
            <div className="left">
              {/*<Link to="/dashboard/review/planosDeAula" className="buttonLeft full-link">
                <TfiLayoutMediaRightAlt />
                <span>Plano de Aula</span>
              </Link>
              */}
              <Link to="/dashboard/review/aulas" className="buttonLeft full-link">
                <FaChalkboardTeacher />
                <span>Aula Teste</span>
              </Link>
              <Link to="/dashboard/review/diario" className="buttonLeft full-link">
                <RiPagesLine />
                <span>Diário</span>
              </Link>
              <Link to="/dashboard/review/fotosEVideos" className="buttonLeft full-link">
                <FaPhotoVideo />
                <span>Fotos e Vídeos</span>
              </Link>
              <Link to="/dashboard/review/propostas" className="buttonLeft full-link">
                <FaHandshake />
                <span>Propostas</span>
              </Link>
              <Link to="/dashboard/review/inventario" className="buttonLeft full-link">
                <MdInventory />
                <span>Inventario</span>
              </Link>
              <Link to="/dashboard/review/contato" className="buttonLeft full-link">
                <IoIosContact />
                <span>Contato</span>
              </Link>
              {/*<Link to="/dashboard/review/guide" className="buttonLeft full-link">
                <GiTeacher />
                <span>Guide</span>
              </Link>*/}
              <Link to="/dashboard/review/feira" className="buttonLeft full-link">
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

export default Review;