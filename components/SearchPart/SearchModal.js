import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Modal, message, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { saveCollectionDetails } from "../../core/actions/collectionActions.js/collectionActions";
import { CloseOutlined } from "@ant-design/icons";
import { unpackPrice } from "@renft/sdk";
import styles from "./searchmodal.module.scss";

const SearchModal = ({
  modalOpen,
  cancelModal,
  collectionItems,
  nftItems,
  getCol,
  getNft,
}) => {
  const [searchText, setSearchText] = useState("");

  //  console.log('ss', nftItems)
  //  console.log('ff', collectionItems)

  const router = useRouter();

  const dispatch = useDispatch();

  const collectionItemDetails = useSelector(
    (state) => state.collectionItemDetails
  );

  const filterCollection = collectionItems?.filter((item) => {
    return searchText.toLowerCase() === ""
      ? item
      : item?.collectionName?.toLowerCase().includes(searchText.toLowerCase());
  });

  const filterNfts = nftItems?.filter((item) => {
    return searchText.toLowerCase() === ""
      ? item
      : item?.metadataName.toLowerCase().includes(searchText.toLowerCase());
  });

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

  const convertToken = (value) => {
    if (value === "1") {
      return "WETH";
    } else if (value === "2") {
      return "DAI";
    } else if (value === "3") {
      return "USDC";
    } else if (value === "4") {
      return "USDT";
    }
  };

  const previewCollectionToSave = (index) => {
    const objToSave = {
      iden: collectionItems[index]?._id,
      colName: collectionItems[index]?.collectionName,
      colSymbol: collectionItems[index]?.collectionSymbol,
      chain: collectionItems[index]?.chain,
      colAddress: collectionItems[index]?.collectionAddress,
    };

    // console.log(objToSave);
    dispatch(saveCollectionDetails(objToSave));

    router.push(`/collections/${objToSave.iden}`);
  };

  useEffect(() => {
    const runFirst = async() => {
    await getCol();
    // await getNft();
    }

    runFirst()
  }, []);

  return (
    <Modal
      open={modalOpen}
      footer={null}
      onCancel={cancelModal}
      className={styles.mainContainer}
    >
      <div className={styles.closeMenu}>
        <CloseOutlined className={styles.closeIcon} onClick={cancelModal} />
      </div>
      <div className={styles.searchPartForm}>
        <input
          type="text"
          placeholder="Search Collections"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
         <h1>Suggested Collections</h1>
      </div>
      {searchText === ""  &&
        (
          <h1 className={styles.notFound}></h1>
        )}
    { searchText !== "" &&  ( <div className={styles.collectionsPart}>
        {/* {filterCollection?.length > 0 && <h1> Collections </h1>} */}
        <div className={styles.collectionsPartItems}>
          {filterCollection.map((item, index) => (
            <div
              key={item?._id}
              className={styles.collectionsPartItem}
              onClick={() => {
                previewCollectionToSave(index);
              }}
            >
              <img
                src={
                  item?.collectionImage === null
                    ? "/images/question.png"
                    : item?.collectionImage
                }
                alt={item?.collectionName}
              />
              <small>
                {item.collectionName.length > 15
                  ? item.collectionName.slice(0, 10) + "..."
                  : item.collectionName}
              </small>
              <small>
                {" "}
                {item.itemCount === null ? "0" : item.itemCount} {"item(s)"}
              </small>
            </div>
          ))}
        </div>
      </div>)}
      {searchText !== "" &&
        filterCollection?.length === 0 &&
        // filterNfts?.length === 0 && 
        (
          <h1 className={styles.notFound}>No items match your search😑...</h1>
        )}
      {/* <div className={styles.nftsPart}> */}
        {/* {filterNfts?.length > 0 && <h1> NFTS </h1>}
        <div className={styles.nftPartItems}>
          {filterNfts.map((item) => (
            <div key={item?._id} className={styles.nftPartItem}>
              <img
                src={nftImageAggregating(item.metadataImage).includes('undefined') ? "/images/no-image-placeholder.png" :nftImageAggregating(item.metadataImage)}
                alt={item?.metadataName}
              />
              <h5> {item?.nftCollectionName?.toLowerCase()} </h5>
              <small>{item?.metadataName === null ? "No name" : item?.metadataName}</small>
              <div className={styles.nftPartBottom}>
                <p className={styles.nftStatus}> {item?.status} </p>
                <h4>
                  {" "}
                  {unpackPrice(item?.price)}{" "}
                  <span> {convertToken(item?.paymentToken)} </span>{" "}
                </h4>
              </div>
            </div>
          ))}
        </div> */}
      {/* </div> */}
      {/* {collectionItems?.length === 0 && nftItems?.length === 0 && (
        <h1 className={styles.notFound}>
          No collections or items available at the moment😑...
        </h1>
      )} */}
    </Modal>
  );
};

export default SearchModal;
