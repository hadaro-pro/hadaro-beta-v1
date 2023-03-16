import React from "react";
import Link from "next/link";
import styles from "./footer.module.scss";

const Footer = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.footerUpperPart}>
        <div className={styles.logoPart}>
          <img src="/Hadaro-BETA-logo.png" alt="hadaro" />
        </div>
        <div className={styles.captionPart}>
          <div className={styles.captionLower}>
            <p>
              {" "}
              <Link href="/mission">MISSION</Link>{" "}
            </p>
            <p>
              {" "}
              <Link href="/feedback"> CONTACT US</Link>
            </p>
            <p>
              {" "}
              <Link href="/feedback"> FEEDBACK</Link>
            </p>
            <p>
              {" "}
              <Link href="/marketplace-discover"> EXPLORE</Link>
            </p>
            <p className={styles.lastPart}>
              {" "}
              <Link href="/marketplace-featured"> MARKETPLACE</Link>
            </p>
          </div>
          <div className={styles.captionLower}>
            <p>
              {" "}
              <Link href="/lend-portfolio">LEND</Link>{" "}
            </p>
            <p>
              {" "}
              <Link href="/portfolio">PORTFOLIO</Link>{" "}
            </p>
            <p>
              {" "}
              <Link href="/faqs">FAQS</Link>{" "}
            </p>
            <p className={styles.lastPart}>
              {" "}
              <Link href="/blog">BLOG</Link>{" "}
            </p>
          </div>
        </div>
        <div className={styles.subscriptionPart}>
          <div className={styles.subscriptionPartUpper}>
            <h2>Join our thriving community.</h2>
          </div>
          <div className={styles.subscriptionPartLower}>
            <p>
              <img src="/images/twitter.png" alt="twitter" />
            </p>
            <p>
              <img src="/images/tiktok.png" alt="tiktok" />
            </p>
            <p>
              <img src="/images/telegram.png" alt="telegram" />
            </p>
            <p>
              <img src="/images/fb-icon.png" alt="facebook" />
            </p>
            <p>
              <img src="/images/discord-icon.png" alt="discord" />
            </p>
            <p>
              <img src="/images/youtube.png" alt="youtube" />
            </p>
          </div>
        </div>
      </div>
      <div className={styles.footerLowerPart}>
        <small>Copyright &copy; Hadaro 2022</small>
      </div>
    </div>
  );
};

export default Footer;
