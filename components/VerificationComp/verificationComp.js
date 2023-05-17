import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dropdown, message, Modal, Tooltip, Alert, Button } from "antd";
import {
  DownOutlined,
  CaretDownOutlined,
  MenuOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  BulbOutlined,
  BulbFilled,
} from "@ant-design/icons";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { client } from "../../utils/client";
import axios from "axios";
import WalletConnect from "../walletConnectModal/WalletConnect";
import styles from "./verificationComp.module.scss";

const VerificationComp = ({
  pendingCollections,
  getPendingCollectionData,
  loadingPendingData,
  verifiedCollection,
  getVerifiedCollection,
  loadingVerifiedData,
  unVerifiedCollection,
  getUnverifiedCollection,
  loadingUnverifiedData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPage, setShowPage] = useState(false);
  const [isApproved, setIsApproved] = useState(null);
  const [currentNote, setCurrentNote] = useState("");
  const [iden, setIden] = useState("");
  const [colImage, setColImage] = useState("");
  const [status, setStatus] = useState(null);
  const [colImgFile, setColImgFile] = useState(null);
  const [imgAsset, setImgAsset] = useState(null);
  const [updateNoteLoading, setUpdateNoteLoading] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [forUnverifiedCol, setForUnverifiedCol] = useState(false);
  forUnverifiedCol;
  const [changeItem, setChangeItem] = useState(false);
  const [indexNum, setIndexNum] = useState(null);

  // console.log("verf", verifiedCollection);

  const addToCurrentForUnverified = (position) => {
    const note = unVerifiedCollection[position].notes;
    const identity = unVerifiedCollection[position]._id;
    // console.log(unVerifiedCollection[position])
    setCurrentNote(note);
    setIden(identity);
    showNotesModal();
  };

  const setCurrentDisplay = (position) => {
    setIndexNum(position);
  };

  const addToCurrentFoVerified = (position) => {
    const note = verifiedCollection[indexNum].notes;
    const identity = verifiedCollection[indexNum]._id;
    // const col_image = verifiedCollection[position].collectionImage;
    // console.log(verifiedCollection[position])
    setCurrentNote(note);
    setIden(identity);
    // setColImage(col_image);
    showNotesModal();
  };

  const addToImageModalForVerified = (position) => {
    const identity = verifiedCollection[indexNum]._id;
    const col_image = verifiedCollection[indexNum].collectionImage;
    setIden(identity);
    setColImage(col_image);
    showImageModal();
  };

  const addToCurrentForPending = (position) => {
    const note = pendingCollections[position].notes;
    const identity = pendingCollections[position]._id;
    // console.log(pendingCollections[position])
    setCurrentNote(note);
    setIden(identity);
    showNotesModal();
  };

  const uploadImage = async (e) => {
    const selectedFile = e.target.files[0];

    // console.log("seas", selectedFile);
    const fileTypes = ["image/jpeg", "image/png", "image/svg"];
    if (fileTypes.includes(selectedFile.type)) {
      client.assets
        .upload("image", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then(async (data) => {
          // console.log(data);
          // const verifyOp = await axios.post(`/api/updateCollectionStatus`, {
          //   iden,
          //   status,
          // });

          // // console.log('xava', verifyOp.data)

          // if (verifyOp.data.status === "success") {
          //   message.success("operation success!");
          //   getVerifiedCollection();
          //   getPendingCollectionData();
          //   getUnverifiedCollection();
          // }

          const response = await axios.post(`/api/updateCollectionImage`, {
            iden,
            image: data.url,
          });

          // console.log("xava", response.data);

          if (response.data.status === "success") {
            message.success("image upload success!");

            if (forUnverifiedCol) {
              const verifyOp = await axios.post(`/api/updateCollectionStatus`, {
                iden,
                status,
              });

              // console.log('xava', verifyOp.data)

              if (verifyOp.data.status === "success") {
                message.success("verification success!");
                getPendingCollectionData();
                getVerifiedCollection()
                handleImageCancel();
                setForUnverifiedCol(false);
              }
            } else {
              setImgAsset(data);
              setColImage(data.url);
              getVerifiedCollection();
              getPendingCollectionData();
              getUnverifiedCollection();
            }
          }

          // if (response.data.msg === "success") {
          //   message.info("image upload success");
          //   setImgAsset(data);
          //   // reloadUserAvatar();
          // }
        })
        .catch((err) => {
          message.error("something went wrong");
        });
    } else {
      message.error("unsupported image type!");
    }
  };

  const handleUpdateNoteToDB = async () => {
    try {
      setUpdateNoteLoading(true);

      const updateNote = await axios.post(`/api/updateCollectionNote`, {
        iden,
        currentNote,
      });

      // console.log('spd_daa', updateNote.data)
      if (updateNote.data.status === "success") {
        message.success("operation success!");
        getPendingCollectionData();
        getUnverifiedCollection();
        getVerifiedCollection();
        handleNotesCancel();
      }

      setUpdateNoteLoading(false);
    } catch (error) {
      // console.error(error)
      setUpdateNoteLoading(false);
    }
  };

  const showNotesModal = () => {
    setIsNotesModalOpen(true);
  };

  const showImageModal = () => {
    setIsImageModalOpen(true);
  };
  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };
  const handleImageCancel = () => {
    setIsImageModalOpen(false);
  };

  const handleNotesCancel = () => {
    setIsNotesModalOpen(false);
  };

  const clearedAddrs = [
    "0x0b8ad9582c257aC029e335788017dCB1dE5FBE21",
    "0xceF5F8490DEE630eC27f5f8A83f387C6d4B8FA10",
  ];

  const showModal = () => {
    // setOpenMenuBar(false);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const router = useRouter();

  const checkIfApproved = () => {
    let arr = [];

    clearedAddrs.forEach((item) => {
      arr.push(item.toLowerCase());
    });

    if (arr.includes(address.toLowerCase())) {
      setIsApproved(true);
    } else {
      setIsApproved(false);
    }
  };

  const { address, connector, isConnected } = useAccount();

  const { data: ensName } = useEnsName({ address });

  const { disconnect } = useDisconnect();

  const handleVerify = async (position) => {
    try {
      const stat = "verified";
      const iden = pendingCollections[position]._id;
      const colImg = pendingCollections[position].collectionImage;

      if (colImg === null || colImg === "") {
        message.info("add an image");
        setForUnverifiedCol(true);
        setStatus(stat);
        setIden(iden);
        setColImage(colImage);
        showImageModal();
      } else {
        const verifyOp = await axios.post(`/api/updateCollectionStatus`, {
          iden,
          status: stat,
        });

        // console.log('xava', verifyOp.data)

        if (verifyOp.data.status === "success") {
          message.success("verification success!");
          getPendingCollectionData();
          getVerifiedCollection();
        }
      }
    } catch (error) {
      // console.error(error);
    }

    // message.success("operation success!");
    // message.info(value)
  };

  const handleDecline = async (value) => {
    try {
      const iden = value;

      const verifyOp = await axios.post(`/api/deleteCollection`, { iden });

      // console.log('xava', verifyOp.data)

      if (verifyOp.data.status === "success") {
        message.success("operation success!");
        getPendingCollectionData();
        getUnverifiedCollection();
        getVerifiedCollection();
      }
    } catch (error) {
      // console.error(error);
    }

    // message.success("operation success!");
    // message.info(value)
  };

  const handleUnverifyForVerified = async () => {
    try {
      const status = "unverified";
      const iden = verifiedCollection[indexNum]._id;

      const verifyOp = await axios.post(`/api/updateCollectionStatus`, {
        iden,
        status,
      });

      // console.log('xava', verifyOp.data)

      if (verifyOp.data.status === "success") {
        message.success("operation success!");
        getVerifiedCollection();
        getPendingCollectionData();
        getUnverifiedCollection();
      }
    } catch (error) {
      // console.error(error);
    }

    // message.success("operation success!");
    // message.info(value)
  };

  const handleVerifyOfUnverified = async (value) => {
    try {
      const status = "verified";
      const iden = value;

      const verifyOp = await axios.post(`/api/updateCollectionStatus`, {
        iden,
        status,
      });

      // console.log('xava', verifyOp.data)

      if (verifyOp.data.status === "success") {
        message.success("operation success!");
        getUnverifiedCollection();
        getPendingCollectionData();
        getVerifiedCollection();
      }
    } catch (error) {
      // console.error(error);
    }

    // message.success("operation success!");
    // message.info(value)
  };

  useEffect(() => {
    if (isConnected) {
      setShowPage(true);
    } else {
      setShowPage(false);
      setIsApproved(null);
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      checkIfApproved();
    }
  }, [isConnected]);

  {
    /* 
                      
                        */
  }

  const items = changeItem
    ? [
        {
          key: "ctn-1",
          label: (
            <button
              onClick={() => handleUnverifyForVerified()}
              className={styles.declineBtn}
            >
              unverify
            </button>
          ),
        },
        {
          key: "ctn-2",
          label: (
            <button
              className={styles.addNotesBtn}
              onClick={() => {
                addToCurrentFoVerified();
              }}
            >
              notes
            </button>
          ),
        },
        {
          key: "ctn-3",
          label: (
            <button
              className={styles.addImagesBtn}
              onClick={() => {
                addToImageModalForVerified();
              }}
            >
              image
            </button>
          ),
        },
      ]
    : [
        {
          label: (
            <p className={styles.dropdownWallet}>
              Connected to {connector?.name}
            </p>
          ),
          key: "item-1",
        },
        {
          label: (
            <p
              onClick={() => {
                disconnect();
                setIsModalOpen(false);
              }}
              className={styles.dropdowndisconnect}
            >
              Disconnect
            </p>
          ),
          key: "item-2",
        },
      ];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.upperPart}>
        {isConnected ? (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <div
              className={styles.walletCred}
              onClick={() => setChangeItem(false)}
            >
              {/* <img src={`${ensAvatar === null ? '/images/wallet-avatar.png' : ensAvatar}`} alt="avatar" /> */}
              <div className={styles.addr}>
                {" "}
                {ensName ? `${ensName} (${address})` : address}
              </div>{" "}
              <div className={styles.addrIcon}>
                <DownOutlined />
              </div>
            </div>
          </Dropdown>
        ) : (
          <>
            <button className={styles.walletConnectBtn} onClick={showModal}>
              Wallet Connect
            </button>
            <WalletConnect modalOpen={isModalOpen} cancelModal={handleCancel} />
          </>
        )}
      </div>
      {!showPage && (
        <div className={styles.connectToView}>
          <h1> Connect your wallet to view page 👀...</h1>
        </div>
      )}
      {isApproved === true && (
        <>
          <div className={styles.infoTipsPart}>
            <p>
              Navigation Tips <BulbFilled style={{ color: "yellow" }} /> : Hover
              on a collection name to see its notes. Click on the
              &apos;Options&apos; button to perform actions on each collection
            </p>
          </div>
          <div className={styles.lowerPart}>
            <div className={styles.lowerPartItems}>
              {pendingCollections?.length > 0 && (
                <h2>Pending Collections List</h2>
              )}
              <div className={styles.listCover}>
                {pendingCollections?.length > 0 && (
                  <div className={styles.listHead}>
                    <p>Name</p>
                    <p>Contract Address</p>
                    <p>Symbol</p>
                    <p>Actions</p>
                  </div>
                )}
                {loadingPendingData ? (
                  <div className={styles.connectToView}>
                    <h1> </h1>
                  </div>
                ) : pendingCollections?.length === 0 ? (
                  <div className={styles.connectToView}>
                    <h1>
                      {" "}
                      No pending verification collections at the moment😴...
                    </h1>
                  </div>
                ) : (
                  pendingCollections?.map((item, index) => (
                    <div key={index} className={styles.listBottom}>
                      <Tooltip
                        title={
                          item.notes === null
                            ? "no notes for this collection yet"
                            : item.notes
                        }
                        color={"#000"}
                      >
                        <p> {item.collectionName} </p>
                      </Tooltip>
                      <p> {item.collectionAddress} </p>
                      <p> {item.collectionSymbol} </p>
                      <div className={styles.actionBtns}>
                        <button
                          onClick={() => handleVerify(index)}
                          className={styles.verifyBtn}
                        >
                          verify
                        </button>
                        <button
                          onClick={() => handleDecline(item._id)}
                          className={styles.declineBtn}
                        >
                          decline
                        </button>
                        <button
                          className={styles.addNotesBtn}
                          onClick={() => {
                            addToCurrentForPending(index);
                          }}
                        >
                          notes
                        </button>
                        <Modal
                          className={styles.noteModalCover}
                          footer={null}
                          open={isNotesModalOpen}
                          onCancel={handleNotesCancel}
                        >
                          <div className={styles.closeMenu}>
                            <CloseOutlined
                              className={styles.closeIcon}
                              onClick={handleNotesCancel}
                            />
                          </div>
                          <div className={styles.noteModalMainPart}>
                            <h4>Add/Update Notes</h4>
                            <textarea
                              value={currentNote === null ? "" : currentNote}
                              onChange={(e) => setCurrentNote(e.target.value)}
                            ></textarea>
                            <button onClick={handleUpdateNoteToDB}>
                              {updateNoteLoading ? "Updating..." : "Update"}
                            </button>
                          </div>
                        </Modal>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className={styles.lowerPartItems}>
              {verifiedCollection?.length > 0 && (
                <h2>Verified Collections List</h2>
              )}
              <div className={styles.listCover}>
                {verifiedCollection?.length > 0 && (
                  <div className={styles.listHead}>
                    <p>Name</p>
                    <p>Contract Address</p>
                    <p>Symbol</p>
                    <p>Actions</p>
                  </div>
                )}
                {loadingVerifiedData ? (
                  <div className={styles.connectToView}>
                    <h1> </h1>
                  </div>
                ) : verifiedCollection?.length === 0 ? (
                  <div className={styles.connectToView}>
                    <h1> No verified collections at the moment😴...</h1>
                  </div>
                ) : (
                  verifiedCollection?.map((item, index) => (
                    <div key={index} className={styles.listBottom}>
                      <Tooltip
                        title={
                          item.notes === null
                            ? "no notes for this collection yet"
                            : item.notes
                        }
                        color={"#000"}
                      >
                        <p> {item.collectionName} </p>
                      </Tooltip>
                      <p> {item.collectionAddress} </p>
                      <p> {item.collectionSymbol} </p>
                      <div className={styles.actionBtnsLower}>
                        <div>
                          <Dropdown menu={{ items }} trigger={["click"]}>
                            <button
                              onClick={() => {
                                setChangeItem(true);
                                setCurrentDisplay(index);
                              }}
                            >
                              {" "}
                              Options <DownOutlined />
                            </button>
                          </Dropdown>
                        </div>
                        {/* <button
                          onClick={() => handleUnverify(item._id)}
                          className={styles.declineBtn}
                        >
                          unverify
                        </button>
                        <button
                          className={styles.addNotesBtn}
                          onClick={() => {
                            addToCurrentFoVerified(index);
                          }}
                        >
                          notes
                        </button>
                        <button
                          className={styles.addImagesBtn}
                          onClick={() => {
                            addToImageModalForVerified(index);
                          }}
                        >
                          image
                        </button> */}
                        <Modal
                          className={styles.noteModalCover}
                          footer={null}
                          open={isImageModalOpen}
                          onCancel={handleImageCancel}
                        >
                          <div className={styles.closeMenu}>
                            <CloseOutlined
                              className={styles.closeIcon}
                              onClick={handleImageCancel}
                            />
                          </div>
                          <div className={styles.noteModalLowerPart}>
                            <h4>Collection Image</h4>
                            <div className={styles.colImageInner}>
                              {colImage === null || colImage === "" ? (
                                <div className={styles.noImageVisible}>
                                  <p>No image for this collection 🤨</p>
                                  <label
                                    className={styles.uploadImgPart}
                                    htmlFor="imagefiles"
                                  >
                                    <small>upload collection image</small>
                                  </label>
                                  <input
                                    id="imagefiles"
                                    type="file"
                                    onChange={(e) => {
                                      setColImgFile(e.target.files[0]);
                                      uploadImage(e);
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className={styles.imageVisible}>
                                  <img
                                    src={colImage}
                                    alt="image"
                                    cross-origin="use-credentials"
                                    className={styles.avatarPart}
                                  />
                                  <div className={styles.changeImage}>
                                    <label htmlFor="imagefile">
                                      <p>Change image</p>
                                    </label>
                                    <input
                                      id="imagefile"
                                      type="file"
                                      onChange={(e) => {
                                        setColImgFile(e.target.files[0]);
                                        uploadImage(e);
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Modal>
                        <Modal
                          className={styles.noteModalCover}
                          footer={null}
                          open={isNotesModalOpen}
                          onCancel={handleNotesCancel}
                        >
                          <div className={styles.closeMenu}>
                            <CloseOutlined
                              className={styles.closeIcon}
                              onClick={handleNotesCancel}
                            />
                          </div>
                          <div className={styles.noteModalMainPart}>
                            <h4>Add/Update Notes</h4>
                            <textarea
                              value={currentNote === null ? "" : currentNote}
                              onChange={(e) => setCurrentNote(e.target.value)}
                            ></textarea>
                            <button onClick={handleUpdateNoteToDB}>
                              {updateNoteLoading ? "Updating..." : "Update"}
                            </button>
                          </div>
                        </Modal>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className={styles.lowerPartItems}>
              {unVerifiedCollection?.length > 0 && (
                <h2>Unverified Collections List</h2>
              )}
              <div className={styles.listCover}>
                {unVerifiedCollection?.length > 0 && (
                  <div className={styles.listHead}>
                    <p>Name</p>
                    <p>Contract Address</p>
                    <p>Symbol</p>
                    <p>Actions</p>
                  </div>
                )}
                {loadingUnverifiedData ? (
                  <div className={styles.connectToView}>
                    <h1> </h1>
                  </div>
                ) : unVerifiedCollection?.length === 0 ? (
                  <div className={styles.connectToView}>
                    <h1> No unverified collections at the moment😴...</h1>
                  </div>
                ) : (
                  unVerifiedCollection?.map((item, index) => (
                    <div key={index} className={styles.listBottom}>
                      <Tooltip
                        title={
                          item.notes === null
                            ? "no notes for this collection yet"
                            : item.notes
                        }
                        color={"#000"}
                      >
                        <p> {item.collectionName} </p>
                      </Tooltip>
                      <p> {item.collectionAddress} </p>
                      <p> {item.collectionSymbol} </p>
                      <div className={styles.actionBtnsLower}>
                        <button
                          onClick={() => handleDecline(item._id)}
                          className={styles.deletedBtn}
                        >
                          delete
                        </button>
                        <button
                          className={styles.addNotesBtn}
                          onClick={() => {
                            addToCurrentForUnverified(index);
                          }}
                        >
                          notes
                        </button>
                        <Modal
                          className={styles.noteModalCover}
                          footer={null}
                          open={isNotesModalOpen}
                          onCancel={handleNotesCancel}
                        >
                          <div className={styles.closeMenu}>
                            <CloseOutlined
                              className={styles.closeIcon}
                              onClick={handleNotesCancel}
                            />
                          </div>
                          <div className={styles.noteModalMainPart}>
                            <h4>Add/Update Notes</h4>
                            <textarea
                              value={currentNote === null ? "" : currentNote}
                              onChange={(e) => setCurrentNote(e.target.value)}
                            ></textarea>
                            <button onClick={handleUpdateNoteToDB}>
                              {updateNoteLoading ? "Updating..." : "Updatine"}
                            </button>
                          </div>
                        </Modal>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className={styles.homeBtn} onClick={() => router.push("/")}>
              <button>Go to Home Page</button>
            </div>
          </div>
        </>
      )}
      {isApproved === false && (
        <div className={styles.connectToView}>
          {" "}
          <h1>You are not cleared to view this page!😮...</h1>
        </div>
      )}
    </div>
  );
};

export default VerificationComp;

{
  /* { loadingVerifiedData ? (<div className={styles.connectToView}>
          <h1> </h1>
        </div>) : verifiedCollection?.length === 0 ? (<div className={styles.connectToView}>
          <h1> No verified collections at the moment😴...</h1>
        </div>) :  verifiedCollection?.map((item, index) =>  (<div 
        key={index}  className={styles.listBottom}>
          <p> {item.collectionName} </p>
          <p> {item.collectionAddress} </p>
          <p> {item.collectionSymbol} </p>
          <div className={styles.actionBtns}>
            <button onClick={() => handleUnverify(item._id)} className={styles.declineBtn}>
              unverify
            </button>
          </div>
        </div>) )
        } */
}
