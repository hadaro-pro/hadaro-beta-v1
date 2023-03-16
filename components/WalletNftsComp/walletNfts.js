import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./walletnfts.module.scss";
import { message } from "antd";
import LendModal from "../LendModal/lendmodal";
import PortfolioLendOutroModal from "../PortfolioLendOutroModal/portfoliolendOutroModal";

const WalletNfts = ({
  collectionName,
  nftname,
  nftImg,
  metadata,
  allInfo,
  verifiedCollectionsArr,
  getWalletNft,
  getLendNfts,
}) => {
  const [loadingLend, setLoadingLend] = useState(false);
  const [loadingApproval, setLoadingApproval] = useState(false);
  const [isLendModalOpen, setIsLendModalOpen] = useState(false);
  const showOutroModal = () => {
    setIsOutroModalOpen(true);
  };
  const [openOutroModalOpen, setOpenOutroModalOpen] = useState(false);
  const [isOutroModalOpen, setIsOutroModalOpen] = useState(false);
  const [currentLendItem, setCurrentLendItem] = useState({
    nftAddress: "",
    tokenID: "",
    amount: 1,
    // nftPrice: 0,
    dailyRentPrice: 0,
    maxRentDuration: 0,
    paymentToken: 1,
    nftStandard: null,
    chain: "0x1",
    collectionName: "",
    collectionSymbol: "",
    nftName: "",
    nftImage: "",
    nftDesc: "",
  });

  const router = useRouter();

  // console.log(currentLendItem)

  const pushToNewArray = () => {
    const metadataInfo = JSON.parse(allInfo.metadata);

    // // setLastPosition(position)
    setCurrentLendItem({
      ...currentLendItem,
      nftAddress: allInfo.token_address,
      tokenID: allInfo.token_id,
      nftStandard: allInfo.contract_type,
      collectionName: allInfo.name,
      collectionSymbol: allInfo.symbol,
      nftName: metadataInfo.name,
      nftImage: metadataInfo.image,
      nftDesc: metadataInfo.description,
    });

    // console.log(metadataInfo)
  };

  const showLendModal = () => {
    setIsLendModalOpen(true);
  };

  const handleLendModalCancel = () => {
    setIsLendModalOpen(false);
  };

  const handleOutroModalClose = () => {
    setIsOutroModalOpen(false);
    setOpenOutroModalOpen(false);
  };

  const performPrepareLend = (item) => {
    const ifCollectionExists = verifiedCollectionsArr.filter(
      (i) =>
        i.collectionAddr.toLowerCase() === allInfo.token_address.toLowerCase()
    );

    // console.log('lki', ifCollectionExists)

    // const collectionVerificationStatus = ifCollectionExists[0].status

    if (ifCollectionExists.length === 0) {
      message.info(
        "Your NFT belongs to a collection not yet registered on the platform, redirecting you to the collection form page",
        [5]
      );

      setTimeout(() => router.push("/new-collection"), 5500);
    } else {
      if (ifCollectionExists[0].status === "verified") {
        if (
          ifCollectionExists[0].collectionAddr.includes(
            allInfo.token_address.toLowerCase()
          )
        ) {
          showLendModal();
          pushToNewArray();
        }
      } else if (ifCollectionExists[0].status === "unverified") {
        message.info("item belongs to an unverified collection");
      } else if (ifCollectionExists[0].status === "pending") {
        message.info(
          "item belongs to a collection still undergoing the verification process"
        );
      }
    }
  };

  return (
    <div className={styles.mainCover}>
      <img
        src={
          metadata === null
            ? "/images/no-image-placeholder.png"
            : nftImg
            ? nftImg
            : nftImg === null
            ? "/images/no-image-placeholder.png"
            : ""
        }
        onError={(e) => (e.target.src = "/images/no-image-placeholder.png")}
        alt={nftname}
        className={styles.imagePart}
      />
      <div className={styles.mainPartLower}>
        <p> {nftname} </p>
        <p className={styles.bottomText}>
          {" "}
          {collectionName === null ? "No Collection Name" : collectionName}{" "}
        </p>

        {/* <p> {nftImg} </p> */}
      </div>
      <div className={styles.mainLendCover}>
        <button
          className={styles.lendButton}
          onClick={() => {
            performPrepareLend();
            // showLendModal();
            // pushToNewArray();
          }}
        >
          Lend
        </button>
        <LendModal
          loadingTxn={loadingLend}
          loadingApproval={loadingApproval}
          modalOpen={isLendModalOpen}
          cancelModal={handleLendModalCancel}
          lendItemObject={currentLendItem}
          setLendItemObject={setCurrentLendItem}
          openCheckout={showOutroModal}
          displayOutroPart={setOpenOutroModalOpen}
        />
        {openOutroModalOpen && (
          <PortfolioLendOutroModal
            outroOpen={isOutroModalOpen}
            cancleOutro={handleOutroModalClose}
            finalLendObject={currentLendItem}
            cancelLendModal={handleLendModalCancel}
            // removeLent={handleRemoveElement}
            // currentLendIndex={lastposition}
            setLoadingTxn={setLoadingLend}
            setApprovalLoad={setLoadingApproval}
            loadingTxn={loadingLend}
            showLendModal={showLendModal}
            getWalletNft={getWalletNft}
            getLendNfts={getLendNfts}
          />
        )}
      </div>
    </div>
  );
};

export default WalletNfts;
