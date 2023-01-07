import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Dropdown } from "antd";
import { DownOutlined, CaretDownOutlined } from "@ant-design/icons";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import axios from 'axios'
import { createClient } from 'urql'
import { SYLVESTER_SUBGRAPH_URL } from '../../../creds' 
import WalletConnect from "../../walletConnectModal/WalletConnect";
import styles from "./topsection.module.scss";

const TopSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openLendMenu, setOpenLendMenu] = useState(false);
  const [openContactMenu, setOpenContactMenu] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };




  const { address, connector, isConnected } = useAccount();
  // const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  const getLendingsFromGraph = async()  => {
      const lendingsQuery = `
        query LendingsQuery {
          lendings {
            id
            cursor
            nftAddress
            tokenID
            lenderAddress
            maxRentDuration
            dailyRentPrice
            paymentToken
            lentAt
            renting {
              renterAddress
              rentDuration
              rentedAt
            }
          }
        }
      `;

      const urqlClient = createClient({
        url: SYLVESTER_SUBGRAPH_URL
      })


      const response = await urqlClient.query(lendingsQuery).toPromise()

      const result = response.data

      // console.log(result)
  }



  useEffect(() => {
    getLendingsFromGraph()
  }, [])


  // const getDataFromSanity = async() => {
  //     try {
  //         const response = await axios.get(`/api/fetchNftData`)

  //         console.log(response.data)
  //     } catch(error) {
  //       console.log(error)
  //     }
  // } 


  // const postDataToSanity = async() => {

  //   let nftAddress = '0x18df6c571f6fe9283b87f910e41dc5c8b77b7da5'
  //  let  tokenID = '8835'
  //  let transactionType = 'lending'

  //   const document = {
  //     _type: 'nftData',
  //      nftAddress,
  //      tokenID,
  //      transactionType
  //   }
  //   try {

  //     const response = await axios.post(`/api/postNftData`, document)
      
  //     console.log(response.data)

  //     // console.log('success')
  //   } catch(e) {
  //     console.error(e)
  //   }
  // }

  // useEffect(() => {
  //   getDataFromSanity()
  // }, [])


  const items = [
    {
      label: (
        <div className={styles.dropdownWallet}>
          Connected to {connector?.name}
        </div>
      ),
      key: "item-1",
    },
    {
      label: (
        <button
          onClick={() => {
            disconnect();
            setIsModalOpen(false);
          }}
          className={styles.dropdowndisconnect}
        >
          Disconnect
        </button>
      ),
      key: "item-2",
    },
  ];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.logoCaptionPart}>
        <Link href="/">
          <img src="/Hadaro-BETA-logo.png" alt="hadaro" />
        </Link>
        <div className={styles.logoCaptionLowerPart}>
          {/* <button onClick={postDataToSanity} >handlePost</button> */}
          <h1>
            Rent In-Game NFTs <br /> to compete
          </h1>
          <p>
          Lend or rent NFT&#39;s to compete <br /> in NFT games across  <br /> the world.
          </p>
          <div className={styles.logoCaptionButtons}>
            <button>
              {" "}
              <Link href="/marketplace-discover"> Rent</Link>{" "}
            </button>
            <button>
              {" "}
              <Link href="lend-portfolio"> Lend </Link>{" "}
            </button>
          </div>
        </div>
      </div>
      <div className={styles.logoMenuPart}>
        <div className={styles.logoMenuCover}>
          <img src="/landing.png" alt="home" />
          <div className={styles.logoMenuMain}>
            <div className={styles.logoMenuMainItems}>
              <p>
                {" "}
                <Link href="/mission">Mission</Link>{" "}
              </p>
              <div
                onMouseEnter={() => setOpenLendMenu(true)}
                onMouseLeave={() => setOpenLendMenu(false)}
                onClick={() => setOpenLendMenu((prev) => !prev)}
                className={styles.compPart}
              >
                <p>
                  {" "}
                  Lend <CaretDownOutlined style={{ color: "#fff" }} />{" "}
                </p>
                <small
                  className={
                    openLendMenu ? styles.displayMenu : styles.displayNone
                  }
                >
                  {" "}
                  <Link href="/lend-portfolio"> Portfolio </Link>{" "}
                </small>
              </div>
              <p>
                {" "}
                <Link href="/marketplace-discover"> Explore </Link>
              </p>
              <div 
               onMouseEnter={() => setOpenContactMenu(true)}
               onMouseLeave={() => setOpenContactMenu(false)}
               onClick={() => setOpenContactMenu((prev) => !prev)}
               className={styles.compPart}>
                <p>
                  {" "}
                  Contact Us <CaretDownOutlined style={{ color: "#fff" }} />
                </p>
                <small className={
                    openContactMenu ? styles.displayMenu : styles.displayNone
                  }>
                  <Link href="/feedback"> Feedback </Link>
                </small>
              </div>
              <p>
                {" "}
                <img src="/images/Search.png" alt="search" />{" "}
              </p>
              <p>
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
                    <button onClick={showModal}>Wallet Connect</button>
                    <WalletConnect
                      modalOpen={isModalOpen}
                      cancelModal={handleCancel} 
                    />
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSection;
