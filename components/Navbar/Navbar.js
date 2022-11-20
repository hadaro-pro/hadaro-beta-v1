import React, { useState } from "react";
import Link from "next/link";
import {Dropdown} from 'antd'
import {DownOutlined, CaretDownOutlined}  from "@ant-design/icons"
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import WalletConnect from "../walletConnectModal/WalletConnect";
import styles from "./navbar.module.scss";

const Navbar = () => {
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

  const { address, connector, isConnected } = useAccount()
  // const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()


   {/* <div>Connected to {connector?.name}</div>
                    <button onClick={disconnect}>Disconnect</button> */}

  const items = [
    { label: <div className={styles.dropdownWallet} >Connected to {connector?.name}</div>, key: 'item-1' },
    { label: <button  onClick={() => {
       disconnect()
       setIsModalOpen(false)
      }} className={styles.dropdowndisconnect} >Disconnect</button>, key: 'item-2' },
  ];
  

  return (
    <div className={styles.mainContainer}>
      <div className={styles.mainCover}>
        <div className={styles.logoCaptionPart}>
          <Link href="/">
            <img src="/Hadaro-BETA-logo.png" alt="hadaro" />
          </Link>
        </div>
        <div className={styles.logoMenuPart}>
          <div className={styles.logoMenuCover}>
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
                      <p className={styles.addr}>
                        {" "}
                        {ensName ? `${ensName} (${address})` : address}
                      </p>{" "}
                      <p className={styles.addrIcon}>
                        <DownOutlined />
                      </p>
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
