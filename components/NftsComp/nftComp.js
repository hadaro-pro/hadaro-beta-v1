import React from "react";
import { message } from "antd";
import axios from "axios";
import styles from "./nftcomp.module.scss";

const NftDisplayComp = ({
  nfts,
  setNfts,
  wallet,
  chain,
  selectedNFTsArray,
  closeModal,
}) => {


  const convertMetadata = (index) => {
    let meta = JSON.parse(nfts[index].metadata)
    return meta?.name
  }

  const performPush = (item) => {
    let consensus = []
    selectedNFTsArray.forEach((el) => {
       if(el.block_number === item.block_number) {
         consensus.push(true)
       } else {
        consensus.push(false)
       }
    })

    if (consensus.includes(true)) {
      message.error('NFT already uploaded')
     }  else {
        selectedNFTsArray.push(item)
        message.success("NFT uploaded successfully!");
         closeModal();
      }

     
  }

  return (
    <>
    {
      nfts?.length === 0 ? (<div className={styles.noNFTPart}>
        <h1>No NFTs found on this network, try switching to another network😓... </h1>
      </div>) : ( <>
        <h4> Your Wallet NFTs </h4>
        <div className={styles.mainCover}>
          {nfts?.map((el, index) => (
            <div key={index} className={styles.banner}>
              <div key={index} className={styles.nftcard}>
                <div className={styles.imageCover}>
                <img 
                onError={(e) =>
                  e.target.src = "/images/no-image-placeholder.png" 
                }
                src={  el.metadata === null ? "/images/no-image-placeholder.png" :  el.image ? el.image : el.image === null ? "/images/no-image-placeholder.png" : ""} />
                </div>
                <div className={styles.lowerPart}>
                  <span> {convertMetadata(index)} </span>
                  <span>
                    {el.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                 performPush(el) 
                }}
              >
                Upload
              </button>
            </div>
          ))}
        </div>
        </>)
    }
    </>
  );
};

export default NftDisplayComp;
