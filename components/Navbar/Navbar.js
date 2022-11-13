import React from "react";
import Link from "next/link";
import styles from "./navbar.module.scss";

const Navbar = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.mainCover}>
        <div className={styles.logoCaptionPart}>
          <Link href="/">
            <img src="/Hadaro-BETA-logo.png" alt="hadaro" />
          </Link>
        </div>
        <div className={styles.logoMenuPart}>
          <div className={styles.logoMenuCover}>
            <div className={styles.logoMenuMain}>
              <p>
                {" "}
                <Link href="/">Home</Link>{" "}
              </p>
              <p>
                {" "}
                <Link href="/about-us">About Us</Link>{" "}
              </p>
              <p>
                {" "}
                <Link href="/marketplace-discover"> Marketplace </Link>
              </p>
              <p>
                {" "}
                <Link href="portfolio">Portfolio</Link>{" "}
              </p>
              <p>
                {" "}
                <Link href="lend-portfolio"> Lend </Link>
              </p>
              <p>
                {" "}
                <img src="/images/Search.png" alt="search" />{" "}
              </p>
              <p>
                {" "}
                <button>Wallet Connect</button>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
