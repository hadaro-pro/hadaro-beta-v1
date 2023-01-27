import React from 'react'
import styles from './walletnfts.module.scss'

const WalletNfts = ({collectionName, nftname, nftImg, metadata}) => {
  return (
    <div className={styles.mainCover}>
      <img src={  metadata === null ? "/images/no-image-placeholder.png" :  nftImg ? nftImg : nftImg === null ? "/images/no-image-placeholder.png" : ""}   onError={(e) =>
         e.target.src = "/images/no-image-placeholder.png" 
       }  alt={nftname} 
       className={styles.imagePart} />
      <div className={styles.mainPartLower}>
        <p> {nftname} </p>
        <p className={styles.bottomText}> {collectionName} </p>
        {/* <p> {nftImg} </p> */}
      </div>
    </div>
  )
}

export default WalletNfts