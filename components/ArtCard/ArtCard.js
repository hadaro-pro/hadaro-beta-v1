import React from "react";
import styles from './artcard.module.scss';
const ArtCard = ({ image, title, collectionName , creatorName, bidPrice  }) => {
  return (
    <div className={styles.mainCover} >
      <img src={image} alt="artwork" />
      <div className={styles.artDesc} >
        <div className={styles.topCaption}>
        <span> {title} </span>
        <span> {collectionName} </span>
        </div>
        <div className={styles.captionDetails}>
          <div className={styles.captionDetails1} >
            <div className={styles.graybg} >
            </div>
            <div className={styles.subcaption}>
            <small className={styles.small1} >Creator</small>
            <small> {creatorName} </small>
            </div>
          </div>
          <div className={styles.captionDetails2}>
            <small>Current Bid</small>
            <small> {bidPrice} </small>
          </div>
        </div>
        <button>RENT</button>
      </div>
    </div>
  );
};

export default ArtCard;
