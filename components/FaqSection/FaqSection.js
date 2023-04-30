import React from "react";
import FaqItems from "../FaqItems/faqItems";
import styles from "./faqsection.module.scss";

const FaqSection = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.upperCover}>
        <h1>FAQS</h1>
        <img src="/images/faq.png" alt="faqs" />
      </div>
      {/* <div className={styles.firstCover}>
        <div className={styles.firstCoverInner}>
          <img
            src="/images/Girl-solving-problem-with-phone.png"
            alt="girl-solving-problem"
          />
          <div className={styles.firstCoverInnerDesc}>
            <h4> What is Hadaro.io? </h4>
            <small>
              Collect interest from renters, creating a <br /> passive income
              stream.
            </small>
          </div>
        </div>
      </div> */}
      {/* <div className={styles.firstCover2}>
        <div className={styles.firstCoverInner2}>
          <img src="/images/Subtract.png" alt="NFTs" />
          <div className={styles.firstCoverInnerDesc2}>
            <h4> Can I purchase NFTs on Hadara.io?</h4>
            <small>
              In the near future, we will introduce both <br /> the NFT trading
              aggregator and NFT <br /> Swap to help optimize the user <br />{" "}
              experience and improve NFT liquidity.
            </small>
          </div>
        </div>
      </div> */}
      <div className={styles.firstCover3}>
        <div className={styles.firstCoverInner3}>
          <div className={styles.firstCoverInnerDesc3}>
            <h4> Does Hadara have an App? </h4>
            <small>No, we do not have an App yet.</small>
          </div>
          <img src="/images/mobile-banking-transaction.png" alt="App" />
        </div>
      </div>
      <div className={styles.firstCover4}>
        <div className={styles.firstCoverInner4}>
          <div className={styles.firstCoverInnerDesc4}>
            <h4>
              {" "}
              What is the plan for chain <br /> deployment on Hadara.io?{" "}
            </h4>
            <small>
              We are actively reaching out to public <br /> blockchain project
              parties. Currently, we <br /> support the Ethereum blockchain. In
              the <br /> next step, we will continue to support <br />{" "}
              mainstream blockchains.
            </small>
          </div>
          <img src="/images/link.png" alt="App" />
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
