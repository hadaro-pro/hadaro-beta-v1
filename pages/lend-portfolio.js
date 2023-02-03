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
import Footer from "../components/Footer/footer";
import LendPortfolioComp from "../components/LendPortfolioComp/lendPortfolioComp";
import Navbar from "../components/Navbar/Navbar";
import PortfolioComp from "../components/PortfolioComp/portfolioComp";

const LendPortfolio = () => {

  const [loadingAvatar, setLoadingAvatar] = useState(false)
  const [verifiedCollectionsArray, setVerifiedCollectionsArray] = useState([]);
  const [userAvatarArray, setUserAvatarArray] = useState([]);

  const { address, connector, isConnected } = useAccount();
  // console.log('bracka', verifiedCollectionsArray)

  const getWalletAvatar = async () => {
    try {
      setLoadingAvatar(true)
      const walletAddr = address;
      const getAvatar = await axios.post(`/api/fetchWalletAvatar`, {
        walletAddr,
      });

      // console.log('cvvr',getAvatar.data)

      setUserAvatarArray(getAvatar.data);
      setLoadingAvatar(false)
    } catch (e) {
      setLoadingAvatar(false)
      console.error(e);
    }
  };

  const getAllCollections = async () => {
    let mainArrItems = [];

    try {
      const getCollections = await axios.get(`/api/fetchCollectionData`);

      //  console.log('xacv', getCollections.data)

      getCollections?.data?.forEach((item) => {
        mainArrItems.push(item.collectionAddress.toLowerCase());
      });

      setVerifiedCollectionsArray(mainArrItems);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getAllCollections();
    getWalletAvatar();
  }, [isConnected]);

  return (
    <div>
      <Navbar />
      <LendPortfolioComp
        verifiedCollections={verifiedCollectionsArray}
        userAvatar={userAvatarArray}
        avatarLoading={loadingAvatar}
      />
      <Footer />
    </div>
  );
};

export default LendPortfolio;
