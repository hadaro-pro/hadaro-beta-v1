import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Dropdown } from "antd";
import { DownOutlined, CaretDownOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
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
import SearchModal from "../../SearchPart/SearchModal";
import styles from "./topsection.module.scss";

const TopSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openLendMenu, setOpenLendMenu] = useState(false);
  const [openContactMenu, setOpenContactMenu] = useState(false);
  const [openMenuBar, setOpenMenuBar] = useState(null);
  const [displayNone, setDisplayNone] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [allNfts, setAllNfts] = useState([])
  const [allCollections, setAllCollections] = useState([])
  // const [nftData, setNftData] = useState(null);


  const showModal = () => {
    setOpenMenuBar(false)
    setIsModalOpen(true);
    // setDisplayNone(true)
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleSearchModalCancel = () => {
    setIsSearchModalOpen(false);
  };





  // console.log('openbar: ', openMenuBar)
 

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



  const getAllCollections = async () => {
    try {
      const getAllCollections = await axios.get(`/api/fetchCollectionData`);
      // console.log("cols", getAllCollections.data);
      // getAllCollections.data.forEach((item) => {
      //   allCollections.push(item)
      // })

      const filterCollections = getAllCollections.data.filter((item) => item.status === "verified" && !item._id.includes('drafts'))

      // console.log('ccc', filterCollections)

      setAllCollections(filterCollections)

      
    } catch (e) {
      console.error(e);
    }
  };

  const getAllNfts = async () => {
    try {
          const response = await axios.get(`/api/fetchAllNftsInCollection`)
          const neededNfts = response.data.filter((item) => item?.status === "available"  && !item._id?.includes('drafts') )
          // console.log("nfts", neededNfts);
      setAllNfts(neededNfts)
          // neededNfts.forEach((item) => {
          //   allNfts.push(item)
          // })
    } catch (e) {
      console.error(e);
    }
  };


  // const handleLentNfts = async() => {
  //   try {

  //     let firtz = []
      
  //     const allNfts = await axios.get(`/api/fetchNftData`)

  //       console.log('nfts result: ', allNfts.data)



  //       allNfts.data.forEach((item) => {
  //         firtz.push({identify: item._id})
  //       })

  //       console.log('geata: ', firtz)

  //     setNftData(firtz)


  //   //  handleUpdateNftStatus()
  // // console.log('parsed data: ', nftData)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // const handleUpdateNftStatus = async() => {

  //   try {
    

  //   const iden =  '1G8IcQVVD0srBVdlxrgUYr'


  //     // const iden = nftData[0]?.identify

  //     // console.log('hirt', idens)

  //     const allNfts = await axios.put(`/api/updateNftData`, {iden})

  //     console.log('nfts patch result: ', allNfts.data)

  //   } catch (error) {
  //     console.error(error) 
  //   }
  // }





  useEffect(() => {
    getAllCollections()
    getAllNfts()
    // getLendingsFromGraph()
    // handleLentNfts()
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
      {/* { openMenuBar ? */}
  { openMenuBar === true && <div className={styles.menuBarContent}>
      <div className={styles.logoMenuBarItems}>
              <p>
                {" "}
                <Link href="/mission">Mission</Link>{" "}
              </p>
              <p>
                {" "}
                <Link href="/portfolio">Portfolio</Link>{" "}
              </p>
              {/* <div
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
              </div> */}
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
                <img src="/images/Search.png" alt="search"  onClick={() => {
                  showSearchModal()
                  setOpenMenuBar(false)
                }} />{" "}
                 <SearchModal
                    modalOpen={isSearchModalOpen}
                    cancelModal={handleSearchModalCancel}
                    collectionItems={allCollections}
                    nftItems={allNfts}
                  />
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
      </div> }
      
   { openMenuBar === false &&   <div className={styles.menuBarContentClose}>
      <div className={styles.logoMenuBarItems}>
              <p>
                {" "}
                <Link href="/mission">Mission</Link>{" "}
              </p>
              <p>
                {" "}
                <Link href="/portfolio">Portfolio</Link>{" "}
              </p>
              {/* <div
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
              </div> */}
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
      </div> }
      {/* // } */}
      <div className={styles.logoCaptionPart}>
      <div className={styles.logoPartItems} >
        <Link href="/">
          <img src="/Hadaro-BETA-logo.png" alt="hadaro" />
        </Link>
        {
          openMenuBar ? <CloseOutlined className={styles.menuOutlined} onClick={() => setOpenMenuBar((prev) => !prev)} /> :  <MenuOutlined  className={styles.menuOutlined}  onClick={() => setOpenMenuBar((prev) => !prev)}  />
        }
       
        </div>
        <div className={styles.logoCaptionLowerPart}>
          {/* <button onClick={postDataToSanity} >handlePost</button> */}
          <h1>
            Rent In-Game NFTs <br /> to compete
          </h1>
          <p>
          Lend or rent NFT&#39;s to compete <br /> in NFT games across  <br /> the world.
          </p>
          <div className={styles.logoCaptionButtons}>
          {/* <button onClick={handleUpdateNftStatus}>
              heifa
            </button> */}
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
              <p>
                {" "}
                <Link href="/portfolio">Portfolio</Link>{" "}
              </p>
              {/* <div
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
              </div> */}
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
                <img src="/images/Search.png" alt="search" 
                 onClick={() => {
                  showSearchModal();
                }}
                />{" "}
              <SearchModal
                    modalOpen={isSearchModalOpen}
                    cancelModal={handleSearchModalCancel}
                    collectionItems={allCollections}
                    nftItems={allNfts}
                  />
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
