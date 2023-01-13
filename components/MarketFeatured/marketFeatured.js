import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { saveCollectionDetails } from "../../core/actions/collectionActions.js/collectionActions";
import ArtCard from "../ArtCard/ArtCard";
import styles from "./marketfeatured.module.scss";
import CollectionCard from "../collectionCard/collectionCard";



const MarketFeatured = ({
  storeCollections,
  imagesArray,
  loadingCollections,
}) => {
  const router = useRouter();

  const dispatch = useDispatch();

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
        ) : (
          <div className={styles.artPart}>
            {storeCollections?.map((element, index) => {
              const singleImage = imagesArray[index]?.parsedImage;
              // console.log('leggo', singleImage)
              return (
                <div
                  key={index}
                  onClick={() => {
                    previewCollectionToSave(index)
                  }}
                >
                  <CollectionCard
                    posterImage={`${singleImage}`}
                    collectionTitle={element.collectionName}
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
