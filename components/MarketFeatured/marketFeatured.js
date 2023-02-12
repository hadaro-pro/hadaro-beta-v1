import React, {useEffect, useState} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { saveCollectionDetails } from "../../core/actions/collectionActions.js/collectionActions";
import ArtCard from "../ArtCard/ArtCard";
import styles from "./marketfeatured.module.scss";
import CollectionCard from "../collectionCard/collectionCard";
import axios from "axios";



const MarketFeatured = ({
  storeCollections,
  imagesArray,
  loadingCollections,
}) => {


  const [finalImg] = useState([])


  const router = useRouter();

  if (imagesArray?.length > 0 ) {
   imagesArray.forEach((item) => {
    finalImg.push(item)
   })
  }


// console.log('img arr', finalImg)

const parseImage = (position) => {
//  console.log(finalImg[position]?.nftImage)
}

  const dispatch = useDispatch();


  const collectionItemDetails = useSelector((state) => state.collectionItemDetails)





  const nftImageAggregating = (image) => {
    let imageToDisplay;
    if (image?.includes(".")) {
      imageToDisplay = image;
    } else {
      imageToDisplay = "https://ipfs.moralis.io:2053/ipfs/" + image;
    }

    if (image?.includes("https://") || image?.includes("data:image/")) {
      imageToDisplay = image;
    } else {
      let splicer = image?.slice(7);
      imageToDisplay = "https://gateway.ipfscdn.io/ipfs/" + splicer;
    }

    return imageToDisplay;
  };

  const getImgForCollection = async(address) => {
    try{
      
          const response = await axios.post(`/api/fetchSingleImage`, {address} )
      
       
          // console.log(response.data)
    

      // const imageToPlace = response.data[0]?.metadataImage

      // const finalRes = nftImageAggregating(imageToPlace)

      // return finalRes
    } catch(e) {
      console.error(e)
    }
  }


 
  // const { itemsArr } = collectionItemDetails

  // console.log('homew: ', collectionItemDetails)


  const previewCollectionToSave = (index) => {
    const objToSave = {
      iden: storeCollections[index]?._id,
      colName: storeCollections[index]?.collectionName,
      colSymbol: storeCollections[index]?.collectionSymbol,
      chain: storeCollections[index]?.chain,
      colAddress: storeCollections[index]?.collectionAddress,
    };

  // console.log(objToSave);
    dispatch(saveCollectionDetails(objToSave))

    router.push(`/collections/${objToSave.iden}`); 
  };



  useEffect(() => {

  }, [])

  return (
    <div className={styles.mainContainer}>
      <div className={styles.caption}>
        <h1>MARKETPLACE</h1>
      </div>
      <div className={styles.mainPart}>
        <h2>FEATURED COLLECTIONS</h2>
        {loadingCollections ? (
          <div className={styles.loadingPart}>
            <h1>{"Loading Collections...."}</h1>
          </div>
        ) : storeCollections?.length === 0 ?  <div className={styles.loadingPart}>
        <h1>No Collections available yet😫...</h1>
      </div> : (
          <div className={styles.artPart}>
            {storeCollections?.map((element, index) => {
              // const imageToPlace = imagesArray[index]?.imageNft
              // // const singleImage = collectionItemDetails?.itemsArr[index]
              // console.log('leggo', imageToPlace) 
              return (
                <div
                  key={index}
                  onClick={() => {
                    previewCollectionToSave(index)
                  }}
                >
                  <CollectionCard
                    posterImage={parseImage(index)}
                    collectionTitle={element.collectionName}
                    status={element.status}
                    colAddr={element.collectionAddress}
                  />
                </div>
              );
            })}
           
          </div>
        )}

        {storeCollections?.length > 8 && (
          <button>
            {" "}
            <Link href="/marketplace-featured-all"> View More </Link>{" "}
          </button>
        )}
      </div>
    </div>
  );
};

export default MarketFeatured;
