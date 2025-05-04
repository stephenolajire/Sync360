import React from "react";
import styles from "./css/Footer.module.css";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h3>Sync360</h3>
          <p className={styles.subtext}>
            Your one-stop shop for all your shopping needs, whether in-store or
            for delivery.
          </p>
        </div>

        {/* <div className={styles.section}>
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div> */}

        <div className={styles.section}>
          <h4>Contact Us</h4>
          <ul>
            <li>
              <span className={styles.contactIcon}>
                <MdEmail />
              </span>
              <span>info@sync360.com</span>
            </li>
            <li>
              <span className={styles.contactIcon}>
                <MdPhone />
              </span>
              <span>+1 234 567 890</span>
            </li>
            <li>
              <span className={styles.contactIcon}>
                <MdLocationOn />
              </span>
              <span>123 Shopping Street</span>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h4>Follow Us</h4>
          <div className={styles.social}>
            <a href="#facebook" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#twitter" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#instagram" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.subtext}>
          &copy; 2025 Sync360. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
