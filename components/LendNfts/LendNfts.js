import React from "react";
import styles from "./lendnfts.module.scss";

const LendNfts = ({ nftImage, nftname, setLendItem, position, loadingLend }) => {




  return (
    <div className={styles.mainCover}>
      <img src={nftImage} alt={nftname} className={styles.imagePart} />
      <div className={styles.mainPartLower}>
        <p> {nftname} </p>
      </div>
      <div className={styles.stopLendButton}>
  { loadingLend ? <button disabled={true} > Processing...</button> :     <button  onClick={() => {setLendItem(position)}} > Stop Lend</button>}
      </div>
    </div>
  );
};

export default LendNfts;
