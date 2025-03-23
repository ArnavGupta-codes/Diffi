import React from 'react'
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const goToHomePage = () => {
    navigate("/");
  };

  return (
    <div>
      <nav className="nav">
        <a className='goToHomePage'  onClick={goToHomePage}><img id="logo" src="/images/logo.jpg" width="100vw" height="90vh" /></a>
        <h1 className="bungee-regular">DiffiScore</h1>
      </nav>
    </div>
  );
}



export default Navbar
