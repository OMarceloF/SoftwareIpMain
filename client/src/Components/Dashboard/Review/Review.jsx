import React from "react";
import '../../../App.css';
import './Review.css';
import { useLocation, Link } from "react-router-dom";

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
      <div className="left">
        <div className="buttonLeft">
          <TfiLayoutMediaRightAlt />
          <Link to="/dashboard/review/planosDeAula"><span>Plano de Aula</span></Link>
        </div>
        <div className="buttonLeft">
          <FaChalkboardTeacher />
          <Link to="/dashboard/review/aulas"><span>Aula</span></Link>
        </div>
        <div className="buttonLeft">
          <RiPagesLine />
          <Link to="/dashboard/review/diario"><span>Diário</span></Link>
        </div>
        <div className="buttonLeft">
          <FaPhotoVideo />
          <Link to="/dashboard/review/fotosEVideos"><span>Fotos e Vídeos</span></Link>
        </div>
        <div className="buttonLeft">
          <FaHandshake />
          <Link to="/dashboard/review/propostas"><span>Propostas</span></Link>
        </div>
        <div className="buttonLeft">
          <MdInventory />
          <Link to="/dashboard/review/inventario"><span>Inventário</span></Link>
        </div>
        <div className="buttonLeft">
          <IoIosContact />
          <Link to="/dashboard/review/contato"><span>Contato</span></Link>
        </div>
        <div className="buttonLeft">
          <GiTeacher />
          <Link to="/dashboard/review/guide"><span>Guide</span></Link>
        </div>
        <div className="buttonLeft">
          <GiLaserSparks />
          <Link to="/dashboard/review/feira"><span>Feira</span></Link>
        </div>
      </div>
    </div>
  )
}

export default Review;