import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dropdown, message } from "antd";
import {
  DownOutlined,
  CaretDownOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
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

  const handleVerify = async (value) => {
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
        getPendingCollectionData();
      }
    } catch (error) {
      console.error(error);
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
      console.error(error);
    }

    // message.success("operation success!");
    // message.info(value)
  };

  const handleUnverify = async (value) => {
    try {
      const status = "unverified";
      const iden = value;

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
      console.error(error);
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
      console.error(error);
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

  const items = [
    {
      label: (
        <p className={styles.dropdownWallet}>Connected to {connector?.name}</p>
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
            <div className={styles.walletCred}>
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
                    <p> {item.collectionName} </p>
                    <p> {item.collectionAddress} </p>
                    <p> {item.collectionSymbol} </p>
                    <div className={styles.actionBtns}>
                      <button
                        onClick={() => handleVerify(item._id)}
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
                    <p> {item.collectionName} </p>
                    <p> {item.collectionAddress} </p>
                    <p> {item.collectionSymbol} </p>
                    <div className={styles.actionBtnsLower}>
                      <button
                        onClick={() => handleUnverify(item._id)}
                        className={styles.declineBtn}
                      >
                        unverify
                      </button>
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
                    <p> {item.collectionName} </p>
                    <p> {item.collectionAddress} </p>
                    <p> {item.collectionSymbol} </p>
                    <div className={styles.actionBtnsLower}>
                      <button
                        onClick={() => handleDecline(item._id)}
                        className={styles.deletedBtn}
                      >
                        delete
                      </button>
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
