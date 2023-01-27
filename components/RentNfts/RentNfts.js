import React from "react";
import styles from "./rentnfts.module.scss";

const RentNfts = ({
  nftImage,
  nftname,
  nftStatus,
  setRentItem,
  position,
  loadingRent,
}) => {
  return (
    <div className={styles.mainCover}>
      <img src={nftImage} alt={nftname} className={styles.imagePart} />
      <div className={styles.mainPartLower}>
        <p> {nftname} </p>
      </div>
      <div className={styles.stopLendButton}>
        {loadingRent ? (
          <button disabled={true}> Processing...</button>
        ) : nftStatus === "in rent" ? (
          <button
            onClick={() => {
              setRentItem(position);
            }}
          >
            {" "}
            Claim Rent
          </button>
        ) : (
          <button
            onClick={() => {
              setRentItem(position);
            }}
          >
            {" "}
            Stop Rent
          </button>
        )}
      </div>
    </div>
  );
};

export default RentNfts;
