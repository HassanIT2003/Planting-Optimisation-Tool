import React from "react";
import styles from "./Header.module.css";
// import logo from "../assets/logo.png";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img
          src="/Planting-optimisations.png"
          alt="Planting Optimization Tool Logo"
        />
        {/* <span>Planting Optimization Tool</span> */}
      </div>
      <nav className={styles.nav}>
        <a href="#">Home</a>
        <a href="#">About Us</a>
        <a href="#">Our Company</a>
        <a href="#">Contact Us</a>
      </nav>
    </header>
  );
}

export default Header;
