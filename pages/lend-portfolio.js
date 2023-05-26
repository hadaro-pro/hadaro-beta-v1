import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useAccount,
  useConnect,
  useSigner,
  useProvider,
  erc721ABI,
  useNetwork,
} from "wagmi";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { saveLastPageUrl } from "../core/actions/passwordLockActions/passwordLockActions";
import Footer from "../components/Footer/footer";
import LendPortfolioComp from "../components/LendPortfolioComp/lendPortfolioComp";
import Navbar from "../components/Navbar/Navbar";
import PortfolioComp from "../components/PortfolioComp/portfolioComp";

const LendPortfolio = () => {
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [verifiedCollectionsArray, setVerifiedCollectionsArray] = useState([]);
  const [userAvatarArray, setUserAvatarArray] = useState([]);

  const { address, connector, isConnected } = useAccount();

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

  // console.log('bracka', verifiedCollectionsArray)

  const getWalletAvatar = async () => {
    try {
      setLoadingAvatar(true);
      const walletAddr = address;
      const getAvatar = await axios.post(`/api/fetchWalletAvatar`, {
        walletAddr,
      });

      // console.log('cvvr',getAvatar.data)

      setUserAvatarArray(getAvatar.data);
      setLoadingAvatar(false);
    } catch (e) {
      setLoadingAvatar(false);
      // console.error(e);
    }
  };

  const getAllCollections = async () => {
    let mainArrItems = [];

    try {
      const getCollections = await axios.get(`/api/fetchCollectionData`);

      //  console.log('xacv', getCollections.data)

      getCollections?.data?.forEach((item) => {
        mainArrItems.push({
          collectionAddr: item.collectionAddress.toLowerCase(),
          status: item.status,
        });
      });

      setVerifiedCollectionsArray(mainArrItems);
    } catch (e) {
      // console.error(e);
    }
  };

  useEffect(() => {
    checkForPassword(savedPassword);
  }, []);

  useEffect(() => {
    getAllCollections();
    getWalletAvatar();
  }, [isConnected, address]);

  return (
    <div>
      <Navbar />
      <LendPortfolioComp
        verifiedCollections={verifiedCollectionsArray}
        userAvatar={userAvatarArray}
        avatarLoading={loadingAvatar}
        reloadUserAvatar={getWalletAvatar}
      />
      <Footer />
    </div>
  );
};

export default LendPortfolio;
