import React from "react";
import { useRouter } from "next/router";
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
  verifiedCollectionsArr
}) => {

  const router = useRouter()

  // console.log('bracka', verifiedCollectionsArr)

  const convertMetadata = (index) => {
    let meta = JSON.parse(nfts[index].metadata)
    return meta?.name
  }

  const performPush = (item) => {

    const ifCollectionExists = verifiedCollectionsArr.filter((i) =>  i.collectionAddr === item.token_address)

    console.log('lki', ifCollectionExists)

    // const collectionVerificationStatus = ifCollectionExists[0].status

 
if (ifCollectionExists.length === 0) {
    message.info('Your NFT belongs to a collection not yet registered on the platform, redirecting you to the collection form page',[5])
  
    setTimeout(() =>  router.push('/new-collection'), 5500)
} else {
  if(ifCollectionExists[0].status === "verified") {
    if(ifCollectionExists[0].collectionAddr.includes(item.token_address.toLowerCase())) {
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
  } else  if(ifCollectionExists[0].status === "unverified") {
    message.info('item belongs to an unverified collection')
  } else  if(ifCollectionExists[0].status === "pending") {
    message.info('item belongs to a collection still undergoing the verification process')
  } 
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
                  <span> 
                    {/* {console.log(el.image)} */}
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
