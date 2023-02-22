import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Dropdown } from "antd";
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
import SearchModal from "../SearchPart/SearchModal";
import styles from "./navbar.module.scss";

const Navbar = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openLendMenu, setOpenLendMenu] = useState(false);
  const [openContactMenu, setOpenContactMenu] = useState(false);
  const [openMenuBar, setOpenMenuBar] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [allNfts, setAllNfts] = useState([])
  const [allCollections, setAllCollections] = useState([])

  const showModal = () => {
    setOpenMenuBar(false);
    setIsModalOpen(true);
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

  const getAllCollections = async () => {
    try {
      const getAllCollections =  await axios.post(`/api/fetchCollectionDataByStatus`, {status: 'verified'});
      // console.log("cols", getAllCollections.data);
      // getAllCollections.data.forEach((item) => {
      //   allCollections.push(item)
      // })

      const filterCollections = getAllCollections.data.filter((item) => item.status === "verified" && !item._id.includes('drafts'))

      // console.log('ccc', filterCollections)

      setAllCollections(filterCollections)

      
    } catch (e) {
      // console.error(e);
    }
  };

  const getAllNfts = async () => {
    try {
      const response = await axios.get(`/api/fetchAllNftsInCollection`)
      const neededNfts = response.data.filter((item) => item?.status === "available"  && !item._id?.includes('drafts') )
      // console.log("nfts", neededNfts);
  setAllNfts(neededNfts)


          

          // console.log("nfts", neededNfts);
      setAllNfts(neededNfts)
          // neededNfts.forEach((item) => {
          //   allNfts.push(item)
          // })
    } catch (e) {
      // console.error(e);
    }
  };

  const { address, connector, isConnected } = useAccount();
  // const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  {
    /* <div>Connected to {connector?.name}</div>
                    <button onClick={disconnect}>Disconnect</button> */
  }

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


  useEffect(() => {
  getAllCollections()
  getAllNfts()
  }, [])

  return (
    <div className={styles.mainContainer}>
      <div className={styles.mainCover}>
        {openMenuBar === true && (
          <div className={styles.menuBarContent}>
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
                className={styles.compPart}
              >
                <p>
                  {" "}
                  Contact Us <CaretDownOutlined style={{ color: "#fff" }} />
                </p>
                <small
                  className={
                    openContactMenu ? styles.displayMenu : styles.displayNone
                  }
                >
                  <Link href="/feedback"> Feedback </Link>
                </small>
              </div>
              <p>
                {" "}
                <img src="/images/Search.png" alt="search" 
                onClick={() => {
                  showSearchModal()
                  setOpenMenuBar(false)
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
        )}
        {openMenuBar === false && (
          <div className={styles.menuBarContentClose}>
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
                className={styles.compPart}
              >
                <p>
                  {" "}
                  Contact Us <CaretDownOutlined style={{ color: "#fff" }} />
                </p>
                <small
                  className={
                    openContactMenu ? styles.displayMenu : styles.displayNone
                  }
                >
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
        )}
        <div className={styles.logoCaptionPart}>
          <Link href="/">
            <img src="/Hadaro-BETA-logo.png" alt="hadaro" />
          </Link>
        </div>

        {openMenuBar ? (
          <CloseOutlined
            className={styles.menuOutlined}
            onClick={() => setOpenMenuBar((prev) => !prev)}
          />
        ) : (
          <MenuOutlined
            className={styles.menuOutlined}
            onClick={() => setOpenMenuBar((prev) => !prev)}
          />
        )}

        <div className={styles.logoMenuPart}>
          <div className={styles.logoMenuCover}>
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
                  className={styles.compPart}
                >
                  <p>
                    {" "}
                    Contact Us <CaretDownOutlined style={{ color: "#fff" }} />
                  </p>
                  <small
                    className={
                      openContactMenu ? styles.displayMenu : styles.displayNone
                    }
                  >
                    <Link href="/feedback"> Feedback </Link>
                  </small>
                </div>
                <p>
                  {" "}
                  <img
                    onClick={() => {
                      showSearchModal();
                    }}
                    src="/images/Search.png"
                    alt="search"
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
    </div>
  );
};

export default Navbar;
