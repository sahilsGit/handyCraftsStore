import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-dark text-light p-3">
      <h5 className="text-center">All Rights Reserved &copy; Sahil</h5>
      <p className="text-center mt-3 footer">
        <Link to={"/about"}>About</Link>
        <Link to={"/contact"}>Contact</Link>
      </p>
    </div>
  );
};

export default Footer;
