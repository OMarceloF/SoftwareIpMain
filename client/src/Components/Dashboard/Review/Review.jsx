import React from "react";
import '../../../App.css';
import './Review.css';

// Icones
import { FaHistory } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { IoMdHome } from "react-icons/io";

const Review = () => {

  return (
    <div className="review">
      <div className="left">
        <div className="logoPage">
        </div>
        <div className="buttonLeft">
          <IoMdHome />
          <a href="#"><span>Plano de Aula</span></a>
        </div>
        <div className="buttonLeft">
          <MdRateReview />
          <a href="#"><span>Aula</span></a>
        </div>
        <div className="buttonLeft">
          <FaHistory />
          <a href="#"><span>Diário</span></a>
        </div>
        <div className="buttonLeft">
          <RxDashboard />
          <a href="#"><span>Fotos e Vídeos</span></a>
        </div>
        <div className="buttonLeft">
          <RxDashboard />
          <a href="#"><span>Propostas</span></a>
        </div>
        <div className="buttonLeft">
          <RxDashboard />
          <a href="#"><span>Inventário</span></a>
        </div>
        <div className="buttonLeft">
          <RxDashboard />
          <a href="#"><span>Contato</span></a>
        </div>
        <div className="buttonLeft">
          <RxDashboard />
          <a href="#"><span>Teachers Guide</span></a>
        </div>
        <div className="buttonLeft">
          <RxDashboard />
          <a href="#"><span>Feira</span></a>
        </div>
        <div className="buttonLeft">
          <RxDashboard />
          <a href="#"><span>PAIP</span></a>
        </div>
        <div className="buttonLeft">
          <RxDashboard />
          <a href="#"><span>OBR</span></a>
        </div>
      </div>
    </div>
  )
}

export default Review;