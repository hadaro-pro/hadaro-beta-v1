import React, { useState, useEffect } from "react";
import Footer from "../components/Footer/footer";
import Navbar from "../components/Navbar/Navbar";
import PortfolioComp from "../components/PortfolioComp/portfolioComp";
import {
  useAccount,
  useConnect,
  useSigner,
  useProvider,
  erc721ABI,
  useNetwork,
} from "wagmi";
import axios from "axios";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { saveLastPageUrl } from "../core/actions/passwordLockActions/passwordLockActions";

import { SYLVESTER_SUBGRAPH_URL } from "../creds";
import { message } from "antd";
import { connect } from "react-redux";

const Portfolio = () => {
  const [wallet, setWallet] = useState(
    "0x6b28eAC8897999B438B23A9bb49361A0c07eA4B1"
    // "0x9233d7CE2740D5400e95C1F441E5B575BDd38d82"
  );

  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [verifiedCollectionsArray, setVerifiedCollectionsArray] = useState([]);
  const [userAvatarArray, setUserAvatarArray] = useState([]);
  const [lendNfts, setLendNfts] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [loadingWalletNfts, setLoadingWalletNfts] = useState(false);
  const [loadingLendingNfts, setLoadingLendingNfts] = useState(false);
  const [rentingNfts, setRentNfts] = useState([]);
  const [loadingRentingNfts, setLoadingRentingNfts] = useState(false);

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

  const { address, isConnected } = useAccount();

  const { chain: mainChain, chains } = useNetwork();

  // console.log('finalComp: ', nfts)

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

  const nftAggregating = (nftList) => {
    nftList?.forEach((item) => {
      let meta = JSON.parse(item.metadata);
      if (meta && meta.image) {
        if (meta.image.includes(".")) {
          item.image = meta.image;
        } else {
          item.image = "https://ipfs.moralis.io:2053/ipfs/" + meta.image;
        }

        if (
          meta.image?.includes("https://") ||
          meta.image?.includes("data:image/")
        ) {
          item.image = meta.image;
        } else {
          let splicer = meta.image?.slice(7);
          item.image = "https://gateway.ipfscdn.io/ipfs/" + splicer;
        }
      }
    });

    setNfts(nftList);
  };

  const handleLentNfts = async () => {
    try {
    } catch (error) {
      // console.error(error);
    }
  };

  const handleGetLendingNfts = async () => {
    try {
      setLoadingLendingNfts(true);

      // const lenderAddr = address

      const response = await axios.post(`/api/fetchLendingNfts`, { address });

      // console.log('responje', response.data)

      // response.data.forEach((item) => {
      //   lendNfts.push(item)
      // })

      const filterItems = response.data.filter(
        (item) =>
          item.transactionType === "lending" ||
          item.transactionType === "lending renting"
      );

      // console.log('responje', filterItems)

      setLendNfts(filterItems);

      setLoadingLendingNfts(false);
    } catch (e) {
      // console.log(e)
    }
  };

  const handleGetRentingNfts = async () => {
    try {
      setLoadingRentingNfts(true);

      const addr = address;

      // console.log('dff', address)

      const response = await axios.post(`/api/fetchRentingNfts`, { addr });

      // console.log('responjek', response.data)

      // response.data.forEach((item) => {
      //   lendNfts.push(item)
      // })

      setRentNfts(response.data);

      setLoadingRentingNfts(false);
    } catch (e) {
      // console.error(e)
    }
  };

  const handleGetAllNfts = async () => {
    try {
      setLoadingWalletNfts(true);

      let allNfts = [];

      const response1 = await axios.get("/api/nft-balance", {
        params: {
          walletaddr: address,
          // walletaddr: wallet,
          chain: "0x5",
        },
      });

      // const nftDataAdd1 = response1?.data?.result?.map((item) => item)

      // allNfts.push(nftDataAdd1)

      // console.log('x-factor: ', response1?.data?.result)

      response1?.data?.result?.forEach((item) => {
        allNfts.push(item);
      });

      // const response2 = await axios.get("/api/nft-balance", {
      //   params: {
      //     walletaddr: address,
      //     // walletaddr: wallet,
      //     chain: "0x89",
      //   },
      // });

      // const nftDataAdd2 = response2?.data?.result?.map((item) => item)

      // allNfts.push(nftDataAdd2)

      // console.log('x-factor@: ', response2?.data?.result)

      // response2?.data?.result?.forEach((item) => {
      //   allNfts.push(item);
      // });

      // console.log('final: ', allNfts)

      nftAggregating(allNfts);

      setLoadingWalletNfts(false);
    } catch (e) {
      // console.error(e);
    }
  };

  useEffect(() => {
    if (isConnected) {
      handleGetAllNfts();
      handleGetLendingNfts();
      handleGetRentingNfts();
      getWalletAvatar();
      getAllCollections();
    }
  }, [isConnected, address]);

  // useEffect(() => {
  //     if(isConnected) {
  //       handleGetLendingNfts()
  //     }
  //   }, [lendNfts])

  return (
    <div>
      <Navbar />
      <PortfolioComp
        walletConnectStatus={isConnected}
        ownedNfts={nfts}
        loadingWallet={loadingWalletNfts}
        lendingNfts={lendNfts}
        loadingLendNfts={loadingLendingNfts}
        setLendingNfts={setLendNfts}
        getNewListFunc={handleGetLendingNfts}
        rentingNfts={rentingNfts}
        getNewListRentFunc={handleGetRentingNfts}
        loadingRentNfts={loadingRentingNfts}
        verifiedCollections={verifiedCollectionsArray}
        userAvatar={userAvatarArray}
        avatarLoading={loadingAvatar}
        getRentingNfts={handleGetRentingNfts}
        getWalletNfts={handleGetAllNfts}
        reloadUserAvatar={getWalletAvatar}
      />
      <Footer />
    </div>
  );
};

export default Portfolio;
