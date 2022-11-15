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
          <h1>
            Never miss your next NFT.
            <br /> We eliminate spam.{" "}
          </h1>
          <div className={styles.captionLower}>
            <p> <Link href="/mission">MISSION</Link> </p>
            <p> <Link href="/faqs">FAQS</Link> </p>
            <p> <Link href="#">OUR BLOG</Link> </p>
            <p> <Link href="marketplace-discover"> MARKETPLACE</Link></p>
          </div>
        </div>
        <div className={styles.subscriptionPart}>
          <div className={styles.subscriptionPartUpper}>
            <h2>Subscribe Us</h2>
            <div className={styles.subscriptionInputCover}>
              <input type="text" placeholder="info@yourgmail.com" />
              <div className={styles.sendIconPart}>
                <img src="/images/send-icon.png" alt="send" />
              </div>
            </div>
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
