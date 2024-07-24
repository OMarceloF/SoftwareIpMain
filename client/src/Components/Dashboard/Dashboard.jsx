import React from "react";
import './Dashboard.css';
import '../../App.css';
import { Link, Outlet, useLocation } from "react-router-dom";


// Icones
import { FaHistory } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { IoMdHome } from "react-icons/io";
import { RiCommunityLine } from "react-icons/ri";



// Assets
import logo from "../../LoginAssets/logoIPSemFundo.png";
import video from "../../LoginAssets/videoFundo.mp4"


const Dashboard = () => {
  const location = useLocation();

  return (
    <div className="homepage">
      <div className="left">
        <div className="logoPage">
          <img src={logo} alt="logo" />
        </div>
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
          <Link to="/dashboard/dashboardGraph"><span>Dashboard</span></Link>
        </div>
        <div className="buttonLeft">
          <RiCommunityLine />
          <Link to="/dashboard/unidades"><span>Unidades</span></Link>
        </div>
      </div>
      <div className="content">
        {location.pathname === "/dashboard" ? (
          <>
            <h2>Bem vindo!</h2>
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


