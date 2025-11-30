import React from "react";
import styles from "./Footer.module.css";
// import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <div className="flex-row">
          <div className="col-4">
            <div className={styles.brandingwrapper}>
              <img
                src="/Planting-optimisations.png"
                alt="Planting Optimization Tool Logo"
              />
              <p>
                Planting Optimization Tool helps farmers and agronomists
                optimize farm species, soil, and sapling recommendations for
                maximum yield and sustainability.
              </p>
            </div>
          </div>
          <div className="col-8">
            <div className="flex-row">
              <div className="col-4">
                <ul>
                  <li>
                    <a href="#">Home</a>
                  </li>
                  <li>
                    <a href="#">Species Finder</a>
                  </li>
                  <li>
                    <a href="#">Sapling Calculator</a>
                  </li>
                  <li>
                    <a href="#">Insights</a>
                  </li>
                </ul>
              </div>
              <div className="col-4">
                <ul>
                  <li>
                    <a href="#">Deakin University</a>
                  </li>
                </ul>
              </div>
              <div className="col-4">
                <ul>
                  <li>
                    <a href="#">Contact Us</a>
                  </li>
                  <li>
                    <a href="#">Terms</a>
                  </li>
                  <li>
                    <a href="#">Privacy</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.copy}>
        &copy; {new Date().getFullYear()} Planting Optimization Tool. All rights
        reserved.
      </div>
    </footer>
  );
}

export default Footer;
