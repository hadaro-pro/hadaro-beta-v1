import React from "react";
import styles from "./lendnfts.module.scss";

const LendNfts = ({ nftImage, nftname, setLendItem, position, loadingLend }) => {




  return (
    <div className={styles.mainCover}>
      <img src={nftImage === null ? "/images/no-image-placeholder.png" : nftImage.includes('undefined') ? "/images/no-image-placeholder.png" : nftImage } alt={nftname} className={styles.imagePart} />
      <div className={styles.mainPartLower}>
        <p> {nftname === null ? "No name" : nftname} </p>
      </div>
      <div className={styles.stopLendButton}>
  {/* { loadingLend ? <button disabled={true} > Processing...</button> :     <button  onClick={() => {setLendItem(position)}} > Stop Lend</button>} */}
  {<button  onClick={() => {setLendItem(position)}} > Show Details </button>}
      </div>
    </div>
  );
};

export default LendNfts;
