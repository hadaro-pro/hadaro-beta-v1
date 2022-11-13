import React from "react";
import styles from "./artportfoliocomp.module.scss";

const artportfolioComp = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.topCaption}>
        <h1>PORTFOLIO</h1>
      </div>

      <div className={styles.mainContentCover}>
        <div className={styles.mainContent}>
          <div className={styles.mainContentDesc}>
            <h3>Short Description</h3>
            <p>
              Sit amet consectetur lorem ipsum dolor, adipisicing elit.
              Excepturi repudiandae magni optio odio doloribus, natus eius
              numquam reprehenderit hic at, aut veniam consectetur magnam
              libero?
            </p>
            <div className={styles.chainInfo}>
              <h4> Blockchain </h4>
              <small> ETH  </small>
            </div>
            <div className={styles.lendPrice}>
              <h4> Lending Price </h4>
              <small>0.995 ETH</small>
            </div>
          </div>
          <div className={styles.mainContentImg}>
            <div  className={styles.ImgCover}>
            <img src="/images/ART07.png" alt="nft" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default artportfolioComp;
