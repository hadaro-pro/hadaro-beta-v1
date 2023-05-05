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
              <Link href="mailto:support@hadaro.com.au"> CONTACT US</Link>
            </p>
            <p>
              {" "}
              <Link href="/feedback"> FEEDBACK</Link>
            </p>
            {/* <p>
              {" "}
              <Link href="/marketplace-discover"> EXPLORE</Link>
            </p> */}
            <p className={styles.lastPart}>
              {" "}
              <Link href="/marketplace-featured"> MARKETPLACE</Link>
            </p>
          </div>
          <div className={styles.captionLower}>
            {/* <p>
              {" "}
              <Link href="/lend-portfolio">LEND</Link>{" "}
            </p> */}
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
              <Link href="https://medium.com/@goHadaro" target="_blank" 
              rel="noopener noreferrer">BLOG</Link>{" "}   
            </p>
          </div>
        </div>
        <div className= {styles.subscriptionPart}>
          <div className={styles.subscriptionPartUpper}>
            <h2>Join our thriving community.</h2>
          </div>
          <div className={styles.subscriptionPartLower}>
            <a
              href="https://twitter.com/gohadaro"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p>
                <img src="/images/twitter.png" alt="twitter" />
              </p>
            </a>

            <a
              href="https://www.linkedin.com/company/hadaro/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "} 
              <p>
                <img src="/images/linkedin.png" alt="linkedin" />
              </p> 
            </a> 
            <a
              href="https://medium.com/@goHadaro"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              <p>
                <img src="/images/medium.png" alt="medium" />
              </p>
            </a>
            <a
              href="https://www.instagram.com/gohadaro/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              <p>
                <img src="/images/instagram.png" alt="instagram" />
              </p>
            </a>
            <a
              href="https://t.me/+rVTKqNA6K184YTRl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              <p>
                <img src="/images/telegram.png" alt="telegram" />
              </p>
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=100088876557442"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p>
                <img src="/images/fb-icon.png" alt="facebook" />
              </p>
            </a>

            {/* <p>
              <img src="/images/tiktok.png" alt="tiktok" />
            </p> */}

            {/* <p>
              <img src="/images/discord-icon.png" alt="discord" />
            </p> */}
            {/* <p>
              <img src="/images/youtube.png" alt="youtube" />
            </p> */}
          </div>
        </div>
      </div>
      <div className={styles.footerLowerPart}>
        <small>Copyright &copy; Hadaro 2023</small>
      </div>
    </div>
  );
};

export default Footer;
