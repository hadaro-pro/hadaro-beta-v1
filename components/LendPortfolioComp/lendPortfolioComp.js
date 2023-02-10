import React, { useEffect, useState } from "react";
import { message, Modal } from "antd";
import axios from "axios";
import {
  useAccount,
  useConnect,
  useSigner,
  useProvider,
  erc721ABI,
  useNetwork,
} from "wagmi";
import {
  Sylvester,
  PaymentToken,
  NFTStandard,
  packPrice,
  unpackPrice,
} from "@renft/sdk";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { client } from "../../utils/client";
import NftDisplayComp from "../NftsComp/nftComp";
import styles from "./lendportfoliocomp.module.scss";
import ToogleNetwork from "../ToggleNetwork/toogleNetwork";
import LendModal from "../LendModal/lendmodal";
import LendOutroModal from "../LendOutroModal/lendOutroModal";

const LendPortfolioComp = ({
  verifiedCollections,
  userAvatar,
  avatarLoading,
}) => {
  // console.log('bracka', verifiedCollections)

  const [wallet, setWallet] = useState(
    "0x6b28eAC8897999B438B23A9bb49361A0c07eA4B1"
    // "0x9233d7CE2740D5400e95C1F441E5B575BDd38d82"
  );

  const [avatarAsset, setAvatarAsset] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [selectedNFTs] = useState([]);
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

  const [chain, setChain] = useState("0x1");
  const [nfts, setNfts] = useState([]);
  const [openLend, setOpenLend] = useState(false);
  const [openRent, setOpenRent] = useState(false);
  const [openWallet, setOpenWallet] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingNfts, setLoadingNfts] = useState(false);
  const [showNftMenu, setShowNftMenu] = useState(false);

  const [lastposition, setLastPosition] = useState(null);

  const [loadingLend, setLoadingLend] = useState(false);

  const [isLendModalOpen, setIsLendModalOpen] = useState(false);
  const [isOutroModalOpen, setIsOutroModalOpen] = useState(false);
  const [openOutroModalOpen, setOpenOutroModalOpen] = useState(false);

  const { address, connector, isConnected } = useAccount();

  const { data: signer } = useSigner();

  const { chain: mainChain, chains } = useNetwork();

  const collateralFreeContract = new Sylvester(signer);

  const handleCheckChain = () => {
    // console.log(mainChain?.name)
  };

  // const sortCorsImage = (img) => {
  //   const corsImageModified = new Image();
  //   corsImageModified.crossOrigin = "Anonymous";
  //   corsImageModified.src = img + "?not-from-cache-please";

  //   return corsImageModified.src

  // }

  const uploadImage = async (e) => {
    const selectedFile = e.target.files[0];

    // console.log('seas', selectedFile)
    const fileTypes = ["image/jpeg", "image/png", "image/svg"];
    if (!isConnected) {
      message.error("Connect wallet to proceed!");
    } else {
      if (fileTypes.includes(selectedFile.type)) {
        client.assets
          .upload("image", selectedFile, {
            contentType: selectedFile.type,
            filename: selectedFile.name,
          })
          .then(async (data) => {
            // console.log(data.url)
            const document = {
              _type: "walletAvatarData",
              walletAddress: address,
              walletAvatar: data.url,
            };

            const response = await axios.post(
              `/api/postUserAvatarData`,
              document
            );

            // console.log('rest', response)
            if (response.data.msg === "success") {
              message.info("image upload success");
              // const imgUrl = sortCorsImage(data.url)
              setAvatarAsset(data);
            }
          });
      } else {
        message.error("unsupported image type!");
      }
    }
  };

  const handleRemoveElement = (position) => {
    // window.alert(position)
    const newArr = selectedNFTs.splice(position, 1);
    setNfts(newArr);
  };

  // console.log(currentLendItem)

  const showOutroModal = () => {
    setIsOutroModalOpen(true);
  };

  const handleOutroModalClose = () => {
    setIsOutroModalOpen(false);
    setOpenOutroModalOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
    // getUserNFTs();
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setNfts(null);
    setShowNftMenu(false);
  };

  const showLendModal = () => {
    setIsLendModalOpen(true);
  };

  const pushToNewArray = (position) => {
    const metadata = JSON.parse(selectedNFTs[position].metadata);

    setLastPosition(position);
    setCurrentLendItem({
      ...currentLendItem,
      nftAddress: selectedNFTs[position].token_address,
      tokenID: selectedNFTs[position].token_id,
      nftStandard: selectedNFTs[position].contract_type,
      collectionName: selectedNFTs[position].name,
      collectionSymbol: selectedNFTs[position].symbol,
      nftName: metadata.name,
      nftImage: metadata.image,
      nftDesc: metadata.description,
    });
  };

  const handleLendModalCancel = () => {
    setIsLendModalOpen(false);
  };

  const nftAggregating = (nftList) => {
    nftList.forEach((item) => {
      let meta = JSON.parse(item.metadata);
      if (meta && meta.image) {
        if (meta.image.includes(".")) {
          item.image = meta.image;
        } else {
          item.image = "https://ipfs.moralis.io:2053/ipfs/" + meta.image;
        }

        if (
          meta.image?.includes("https://") ||
          meta.image?.includes("data:image/")
        ) {
          item.image = meta.image;
        } else {
          let splicer = meta.image?.slice(7);
          item.image = "https://gateway.ipfscdn.io/ipfs/" + splicer;
        }
      }
    });

    setNfts(nftList);
  };

  const getUserNFTs = async () => {
    setLoadingNfts(true);
    try {
      const response = await axios.get("/api/nft-balance", {
        params: {
          walletaddr: address,
          // walletaddr: wallet,
          chain: chain,
        },
      });

      if (response.data.result) {
        nftAggregating(response.data.result);
      }

      setLoadingNfts(false);
      setShowNftMenu(true);
      // console.log(response.data);
      // message.success(response.data)
    } catch (error) {
      console.error(error);
    }
  };

  const createId = (value) => {
    const result = value
      .replace(/([^\w ]|_)/g, "")
      .split(" ")
      .join("-")
      .toLowerCase();
    return result;
  };

  const handleUploadNftData = async () => {
    const nftAddress = "0x999e88075692bCeE3dBC07e7E64cD32f39A1D3ab";
    const lenderAddress = "0x0b8ad9582c257aC029e335788017dCB1dE5FBE21";
    const tokenID = "30916";
    const chain = "0x1";
    const price = packPrice(10 / 10000);
    const paymentToken = "WETH";
    const maxDuration = 15;
    const transactionType = "lending";
    const collectionName = "WIZARDS & DRAGONS GAME";
    const collectionSymbol = "WnD";
    const collectionAddress = "0x999e88075692bCeE3dBC07e7E64cD32f39A1D3ab";

    try {
      const document = {
        _type: "nftData",
        nftAddress,
        tokenID,
        chain,
        lenderAddress,
        price,
        paymentToken,
        maxDuration,
        transactionType,
      };

      const collection = {
        _type: "collectionsData",
        _id: createId(collectionName),
        collectionName,
        collectionSymbol,
        chain,
        collectionAddress,
        // collectionNfts: document
      };

      const response = await axios.post(`/api/postNftData`, document);

      // console.log('for nftDataCreation', response.data.msg);

      if (response.data.msg === "success") {
        const res = await axios.post(`/api/postCollectionsData`, collection);
        // console.log('for collectionCreation', res.data);

        if (res.data.msg === "success") {
          // const identifier = createId(collectionName)
          // const pushToCollection = await axios.put(`/api/updateCollection`, document,       {params: {
          //     collectionId: identifier
          //   }})
          //  console.log(pushToCollection.data.msg)
        }

        if (
          res.data.response.body.error.items[0].error.description ===
          `Document by ID "${createId(collectionName)}" already exists`
        ) {
          // console.log('yes')
          //     const getCollections = await axios.get(`/api/fetchCollectionData`);
          //   const { data } = getCollections
          //   console.log(data)
          //     const getMatchingCollection = data.filter((el) => el.collectionAddress === nftAddress )
          //     console.log(`'${getMatchingCollection[0]._id}'`)
          //   const identifier = getMatchingCollection[0]._id
          // const pushToCollection = await axios.patch(`/api/updateCollection`, document,       {params: {
          //     collectionId: identifier
          //   }})
          //   console.log('updateMessage: ', pushToCollection)
        }

        // Document by ID "wizards--dragons-game" already exists

        // if(res.data.msg === undefined) {
        //   const getCollections = await axios.get(`/api/fetchCollectionData`);

        //   const { data } = getCollections

        //   console.log(data)

        //   const getMatchingCollection = data.filter((el) => el.collectionAddress === nftAddress )

        //   const identifier = getMatchingCollection._id

        // const pushToCollection = await axios.put(`/api/updateCollection`, document,       {params: {
        //     collectionId: identifier
        //   }})

        //   console.log(pushToCollection.data.msg)

        // }
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // console.log('xama', verifiedCollectionsArray)

  //   useEffect(() => {
  //  getAllCollections()
  //   }, [])

  {
    /* <img src="/images/port-img.png" alt="img" /> */
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.caption}>
        <h1>PORTFOLIO</h1>
      </div>

      <div className={styles.mainComp}>
        <div className={styles.mainCompInner}>
          <div className={styles.imgPart}>
            {!isConnected ? (
              <div className={styles.waitingPart}>
                {" "}
                <p>connect wallet to view</p>
              </div>
            ) : avatarLoading ? (
              <div className={styles.waitingPart}></div>
            ) : userAvatar?.length === 0 ? (
              <div className={styles.formUpperImageContainer}>
                <label
                  className={styles.formUpperImageDiv}
                  htmlFor="imagefiles"
                >
                  {avatarAsset !== null ? (
                    <img
                      src={avatarAsset?.url}
                      alt="image"
                      className={styles.imgUpload}
                    />
                  ) : (
                    <p>upload avatar</p>
                  )}
                </label>
                <input
                  id="imagefiles"
                  type="file"
                  onChange={(e) => {
                    setAvatarFile(e.target.files[0]);
                    uploadImage(e);
                  }}
                />
              </div>
            ) : (
              <img
                src={userAvatar[0]?.walletAvatar}
                alt="avatar"
                className={styles.avatarPart}
              />
            )}
          </div>
          <div className={styles.lowerPart}>
            <div className={styles.menuItem}>
              <div
                className={styles.menuItemTop}
                onClick={() => {
                  setOpenLend((prev) => !prev);
                }}
              >
                <img
                  src={`${
                    openLend ? "/images/minus.png" : "/images/cross.png"
                  }`}
                  alt=""
                  // onClick={() => {
                  //   setOpenLend((prev) => !prev);
                  // }}
                />
                <p>Lend</p>
              </div>
              <div
                className={
                  openLend ? styles.dropdownmenu : styles.dropdownmenuinactive
                }
              >
                <div className={styles.subdropmenu}>
                  <div className={styles.submenucover}>
                    {selectedNFTs?.length > 0 &&
                      selectedNFTs?.map((item, index) => (
                        <div key={index} className={styles.lendArt}>
                          <div className={styles.lendArtImage}>
                            <img
                              src={item.image ? item.image : ""}
                              alt={item.name}
                            />
                          </div>
                          <div className={styles.lendArtButtons}>
                            <button
                              onClick={() => {
                                showLendModal();
                                pushToNewArray(index);
                              }}
                            >
                              Lend
                            </button>
                            <button onClick={() => handleRemoveElement(index)}>
                              Remove
                            </button>
                          </div>
                          <LendModal
                            loadingTxn={loadingLend}
                            modalOpen={isLendModalOpen}
                            cancelModal={handleLendModalCancel}
                            lendItemObject={currentLendItem}
                            setLendItemObject={setCurrentLendItem}
                            openCheckout={showOutroModal}
                            displayOutroPart={setOpenOutroModalOpen}
                          />
                          {openOutroModalOpen && (
                            <LendOutroModal
                              outroOpen={isOutroModalOpen}
                              cancleOutro={handleOutroModalClose}
                              finalLendObject={currentLendItem}
                              cancelLendModal={handleLendModalCancel}
                              removeLent={handleRemoveElement}
                              currentLendIndex={lastposition}
                              setLoadingTxn={setLoadingLend}
                              loadingTxn={loadingLend}
                              showLendModal={showLendModal}
                            />
                          )}
                        </div>
                      ))}
                    <div className={styles.uploadArt}>
                      <div className={styles.uploadArtImage}>
                        <img
                          style={{ cursor: "pointer" }}
                          className={styles.crxImage}
                          onClick={() => {
                            if (isConnected) {
                              showModal();
                            } else {
                              message.error(
                                "Please connect your wallet to proceed"
                              );
                            }
                          }}
                          src="/images/cross.png"
                          alt="add"
                        />
                      </div>
                      <small>Upload Arts</small>
                      <Modal
                        open={isModalOpen}
                        footer={null}
                        onCancel={handleCancel}
                        className={styles.modalContainer}
                      >
                        <div className={styles.closeMenu}>
                          <CloseOutlined
                            className={styles.closeIcon}
                            onClick={handleCancel}
                          />
                        </div>
                        <div className={styles.modalContent}>
                          <ToogleNetwork
                            setChain={setChain}
                            handleGetNFTs={getUserNFTs}
                            lendItemObject={currentLendItem}
                            setLendItemObject={setCurrentLendItem}
                          />
                          {loadingNfts ? (
                            <div className={styles.loadingPart}>
                              <h1>Fetching NFTs from your wallet... </h1>
                            </div>
                          ) : (
                            showNftMenu && (
                              <div className={styles.finalItems}>
                                <NftDisplayComp
                                  nfts={nfts}
                                  selectedNFTsArray={selectedNFTs}
                                  closeModal={handleCancel}
                                  verifiedCollectionsArr={verifiedCollections}
                                  // wallet={wallet}
                                  // chain={chain}
                                  //  setNfts={setNfts}
                                />
                              </div>
                            )
                          )}
                        </div>
                      </Modal>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <button onClick={handleCheckChain}>
          stop lend
        </button> */}
      </div>
    </div>
  );
};

export default LendPortfolioComp;
