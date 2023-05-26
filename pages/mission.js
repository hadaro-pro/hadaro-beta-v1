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
import { useRouter } from "next/router";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { saveLastPageUrl } from "../core/actions/passwordLockActions/passwordLockActions";

import MissionComp from "../components/Mission/MissionComp";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/footer";
import styles from "../styles/mission.module.scss";

const Mission = () => {
  const { address, connector, isConnected } = useAccount();
  // const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  const [openLendMenu, setOpenLendMenu] = useState(false);
  const [openMenuBar, setOpenMenuBar] = useState(null);
  const [openContactMenu, setOpenContactMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const savedPasswordDetails = useSelector((state) => state.sitePassword);

  const { savedPassword } = savedPasswordDetails;

  // console.log('vgy', savedPassword)
  // console.log('vagygt', savedPasswordDetails)

  const checkForPassword = async (password) => {
    try {
      if (savedPassword === null) {
        dispatch(saveLastPageUrl(router.pathname));
        router.push("/password-lock");
      } else {
        const fetchedPassword = await axios.post(`/api/fetchPassword`);
        const passDetails = fetchedPassword.data[0]?.password;
        // console.log('pass', passDetails)
        const checkPass = await axios.post(`/api/checkPassword`, {
          fetchedPassword: passDetails,
          password: savedPassword,
        });
        const checkResult = checkPass.data?.msg;
        // console.log('rety: ', checkResult)
        if (password === undefined || password === null || !checkResult) {
          dispatch(saveLastPageUrl(router.pathname));
          router.push("/password-lock");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkForPassword(savedPassword);
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Navbar /* setMenubar={setOpenMenuBar} */ />
      <MissionComp />
      <Footer />
    </div>
  );
};

export default Mission;

// { openMenuBar === true && <div className={styles.menuBarContent}>
// <div className={styles.logoMenuBarItems}>
//         <p>
//           {" "}
//           <Link href="/mission">Mission</Link>{" "}
//         </p>
//         <div
//           onMouseEnter={() => setOpenLendMenu(true)}
//           onMouseLeave={() => setOpenLendMenu(false)}
//           onClick={() => setOpenLendMenu((prev) => !prev)}
//           className={styles.compPart}
//         >
//           <p>
//             {" "}
//             Lend <CaretDownOutlined style={{ color: "#fff" }} />{" "}
//           </p>
//           <small
//             className={
//               openLendMenu ? styles.displayMenu : styles.displayNone
//             }
//           >
//             {" "}
//             <Link href="/lend-portfolio"> Portfolio </Link>{" "}
//           </small>
//         </div>
//         <p>
//           {" "}
//           <Link href="/marketplace-discover"> Explore </Link>
//         </p>
//         <div
//          onMouseEnter={() => setOpenContactMenu(true)}
//          onMouseLeave={() => setOpenContactMenu(false)}
//          onClick={() => setOpenContactMenu((prev) => !prev)}
//          className={styles.compPart}>
//           <p>
//             {" "}
//             Contact Us <CaretDownOutlined style={{ color: "#fff" }} />
//           </p>
//           <small className={
//               openContactMenu ? styles.displayMenu : styles.displayNone
//             }>
//             <Link href="/feedback"> Feedback </Link>
//           </small>
//         </div>
//         <p>
//           {" "}
//           <img src="/images/Search.png" alt="search" />{" "}
//         </p>
//         <p>
//           {isConnected ? (
//             <Dropdown menu={{ items }} trigger={["click"]}>
//               <div className={styles.walletCred}>
//                 {/* <img src={`${ensAvatar === null ? '/images/wallet-avatar.png' : ensAvatar}`} alt="avatar" /> */}
//                 <div className={styles.addr}>
//                   {" "}
//                   {ensName ? `${ensName} (${address})` : address}
//                 </div>{" "}
//                 <div className={styles.addrIcon}>
//                   <DownOutlined />
//                 </div>
//               </div>
//             </Dropdown>
//           ) : (
//             <>
//               <button onClick={showModal}>Wallet Connect</button>
//               <WalletConnect
//                 modalOpen={isModalOpen}
//                 cancelModal={handleCancel}
//               />
//             </>
//           )}
//         </p>
//       </div>
// </div> }

// { openMenuBar === false &&   <div className={styles.menuBarContentClose}>
// <div className={styles.logoMenuBarItems}>
//         <p>
//           {" "}
//           <Link href="/mission">Mission</Link>{" "}
//         </p>
//         <div
//           onMouseEnter={() => setOpenLendMenu(true)}
//           onMouseLeave={() => setOpenLendMenu(false)}
//           onClick={() => setOpenLendMenu((prev) => !prev)}
//           className={styles.compPart}
//         >
//           <p>
//             {" "}
//             Lend <CaretDownOutlined style={{ color: "#fff" }} />{" "}
//           </p>
//           <small
//             className={
//               openLendMenu ? styles.displayMenu : styles.displayNone
//             }
//           >
//             {" "}
//             <Link href="/lend-portfolio"> Portfolio </Link>{" "}
//           </small>
//         </div>
//         <p>
//           {" "}
//           <Link href="/marketplace-discover"> Explore </Link>
//         </p>
//         <div
//          onMouseEnter={() => setOpenContactMenu(true)}
//          onMouseLeave={() => setOpenContactMenu(false)}
//          onClick={() => setOpenContactMenu((prev) => !prev)}
//          className={styles.compPart}>
//           <p>
//             {" "}
//             Contact Us <CaretDownOutlined style={{ color: "#fff" }} />
//           </p>
//           <small className={
//               openContactMenu ? styles.displayMenu : styles.displayNone
//             }>
//             <Link href="/feedback"> Feedback </Link>
//           </small>
//         </div>
//         <p>
//           {" "}
//           <img src="/images/Search.png" alt="search" />{" "}
//         </p>
//         <p>
//           {isConnected ? (
//             <Dropdown menu={{ items }} trigger={["click"]}>
//               <div className={styles.walletCred}>
//                 {/* <img src={`${ensAvatar === null ? '/images/wallet-avatar.png' : ensAvatar}`} alt="avatar" /> */}
//                 <div className={styles.addr}>
//                   {" "}
//                   {ensName ? `${ensName} (${address})` : address}
//                 </div>{" "}
//                 <div className={styles.addrIcon}>
//                   <DownOutlined />
//                 </div>
//               </div>
//             </Dropdown>
//           ) : (
//             <>
//               <button onClick={showModal}>Wallet Connect</button>
//               <WalletConnect
//                 modalOpen={isModalOpen}
//                 cancelModal={handleCancel}
//               />
//             </>
//           )}
//         </p>
//       </div>
// </div> }
