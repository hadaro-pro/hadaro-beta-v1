import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import axios from "axios";
import { useAccount, useConnect } from "wagmi";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import NftDisplayComp from "../NftsComp/nftComp";
import styles from "./lendportfoliocomp.module.scss";
import ToogleNetwork from "../ToggleNetwork/toogleNetwork";
import LendModal from "../LendModal/lendmodal";
import LendOutroModal from "../LendOutroModal/lendOutroModal";

const LendPortfolioComp = () => {
  const [wallet, setWallet] = useState("0x6b28eAC8897999B438B23A9bb49361A0c07eA4B1"
    // "0x9233d7CE2740D5400e95C1F441E5B575BDd38d82"
  );

  const [selectedNFTs] = useState([]);
  const [currentLendItem, setCurrentLendItem] = useState({
    nftAddress: "", 
    tokenID: "", 
    amount: 1,
    nftPrice: 0,
    dailyRentPrice: 0,
    maxRentDuration: 0,
    paymentToken: "weth"
  })
  

  const [chain, setChain] = useState("0x1");
  const [nfts, setNfts] = useState([]);
  const [openLend, setOpenLend] = useState(false);
  const [openRent, setOpenRent] = useState(false);
  const [openWallet, setOpenWallet] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingNfts, setLoadingNfts] = useState(false);
  const [showNftMenu, setShowNftMenu] = useState(false);

  const [isLendModalOpen, setIsLendModalOpen] = useState(false);
  const [isOutroModalOpen, setIsOutroModalOpen] = useState(false);
  const [openOutroModalOpen, setOpenOutroModalOpen] = useState(false)




  const { address, connector, isConnected } = useAccount();

  const handleRemoveElement = (position) => {
    // window.alert(position)
      const newArr = selectedNFTs.splice(position, 1)
      setNfts(newArr)
  }

  console.log(currentLendItem)

  const showOutroModal = () => {
    setIsOutroModalOpen(true)
  }

  const handleOutroModalClose = () => {
    setIsOutroModalOpen(false)
    setOpenOutroModalOpen(false)
  }

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
  
   

    setIsLendModalOpen(true)
  
  };

  const pushToNewArray = (position) => {
    setCurrentLendItem({ ...currentLendItem,
       nftAddress: selectedNFTs[position].token_address,
       tokenID: selectedNFTs[position].token_id,
    })
  }

  const handleLendModalCancel = () => {
    setIsLendModalOpen(false);
    
  };

  const nftAggregating = (nftList) => {
    nftList.forEach((item) => {
      let meta = JSON.parse(item.metadata);
      if (meta && meta.image) {
        if (meta.image.includes(".")) {
          item.image = meta.image;
        } 
        else {
          item.image = "https://ipfs.moralis.io:2053/ipfs/" + meta.image;
        }

        if(meta.image?.includes("https://")) {
          item.image = meta.image;
        } else {
          let splicer =  meta.image?.slice(7)
          item.image =  "https://gateway.ipfscdn.io/ipfs/" + splicer;
         
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
          // walletaddr: address,
          walletaddr: wallet,
          chain: chain,
        },
      }); 

      if (response.data.result) {
        nftAggregating(response.data.result);
      }

      setLoadingNfts(false);
      setShowNftMenu(true);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.caption}>
        <h1>PORTFOLIO</h1>
      </div>

      <div className={styles.mainComp}>
        <div className={styles.mainCompInner}>
          <div className={styles.imgPart}>
            <img src="/images/port-img.png" alt="img" />
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
                            <button onClick={() => {
                               showLendModal()
                               pushToNewArray(index)
                            }} >Lend</button>
                            <button onClick={() => handleRemoveElement(index)} >Remove</button>
                          </div>
                          <LendModal  modalOpen={isLendModalOpen} cancelModal={handleLendModalCancel} lendItemObject={currentLendItem} 
                          setLendItemObject={setCurrentLendItem}
                           openCheckout={showOutroModal}
                           displayOutroPart={setOpenOutroModalOpen}
                          />
                          {
                            openOutroModalOpen &&  <LendOutroModal outroOpen={isOutroModalOpen} cancleOutro={handleOutroModalClose} finalLendObject={currentLendItem}  />
                          }
                        </div>
                      ))}
                    <div className={styles.uploadArt}>
                      <div className={styles.uploadArtImage}>
                        <img
                          style={{ cursor: "pointer" }}
                          onClick={showModal}
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
                          />
                          {loadingNfts ? (
                            <div className={styles.loadingPart}>
                              <h1>Fetching NFTs from your wallet... </h1>
                            </div>
                          ) : (
                            showNftMenu && (
                              <NftDisplayComp
                                nfts={nfts}
                                selectedNFTsArray={selectedNFTs}
                                closeModal={handleCancel}
                                // wallet={wallet}
                                // chain={chain}
                                //  setNfts={setNfts}
                              />
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
      </div>
    </div>
  );
};

export default LendPortfolioComp;
