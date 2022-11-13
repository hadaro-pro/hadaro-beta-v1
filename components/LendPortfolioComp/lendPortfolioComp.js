import React, { useState } from "react";
import styles from "./lendportfoliocomp.module.scss";

const LendPortfolioComp = () => {
  const [openLend, setOpenLend] = useState(false);
  const [openRent, setOpenRent] = useState(false);
  const [openWallet, setOpenWallet] = useState(false);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.caption}>
        <h1>PORTFOLIO</h1>
      </div>

      <div className={styles.mainComp}>
        <div className={styles.mainCompInner}>
          <div className={styles.imgPart}>
            <img src="/images/port-img.png" alt="img" />
          </div>
          <div className={styles.lowerPart}>
            <div className={styles.menuItem}>
              <div className={styles.menuItemTop}>
                <img
                  src={`${
                    openLend ? "/images/minus.png" : "/images/cross.png"
                  }`}
                  alt=""
                  onClick={() => {
                    setOpenLend((prev) => !prev);
                  }}
                />
                <p>Lend</p>
              </div>
              <div
                className={
                  openLend ? styles.dropdownmenu : styles.dropdownmenuinactive
                }
              >
                <div className={styles.subdropmenu}>
                  <div className={styles.submenucover}>
                    <div className={styles.lendArt}>
                      <div className={styles.lendArtImage}>
                        <img src="/images/lend-portfolio.png" alt="add" />
                      </div>
                      <div className={styles.lendArtButtons} >
                        <button>Lend</button>
                        <button>Remove</button>
                      </div>
                    </div>

                    <div className={styles.uploadArt}>
                      <div className={styles.uploadArtImage}>
                        <img src="/images/cross.png" alt="add" />
                      </div>
                      <small>Upload Arts</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LendPortfolioComp;
