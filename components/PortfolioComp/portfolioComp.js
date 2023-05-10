import React, { useEffect, useState } from "react";
import LendNfts from "../LendNfts/LendNfts";
import WalletNfts from "../WalletNftsComp/walletNfts";
import axios from "axios";
import { Contract } from "ethers";
import Web3 from "web3";
import { moralisApiKey } from "../../creds";
import { createClient } from "urql";
import { SYLVESTER_SUBGRAPH_URL } from "../../creds";
import {
  useAccount,
  useConnect,
  useSigner,
  useProvider,
  erc721ABI,
  useNetwork,
} from "wagmi";
import { HADARO_GOERLI_ABI, HADARO_GOERLI_ADDRESS } from "../../constants/abis";
import { client } from "../../utils/client";
import {
  Sylvester,
  PaymentToken,
  NFTStandard,
  packPrice,
  unpackPrice,
  SylvesterV0FunctionInterface,
  getRenftContract,
  DEPLOYMENT_SYLVESTER_ETHEREUM_MAINNET_V0,
} from "@renft/sdk";
import moment from "moment";
import styles from "./portfoliocomp.module.scss";
import { message, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import RentNfts from "../RentNfts/RentNfts";

const PortfolioComp = ({
  walletConnectStatus,
  ownedNfts,
  loadingWallet,
  lendingNfts,
  loadingLendNfts,
  getRentingNfts,
  setLendingNfts,
  getNewListFunc,
  rentingNfts,
  getNewListRentFunc,
  loadingRentNfts,
  verifiedCollections,
  userAvatar,
  avatarLoading,
  getWalletNfts,
  reloadUserAvatar,
}) => {
  const [openLend, setOpenLend] = useState(false);
  const [openRent, setOpenRent] = useState(false);
  const [openWallet, setOpenWallet] = useState(false);
  const [loadingLendRemove, setLoadingLendRemove] = useState(false);
  const [loadingRentRemove, setLoadingRentRemove] = useState(false);
  const [avatarAsset, setAvatarAsset] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [selectedNFTs] = useState([]);
  const [currentLendItem, setCurrentLendItem] = useState({
    nftAddress: "",
    tokenID: "",
    amount: 1,
    // nftPrice: 0,
    dailyRentPrice: 0,
    maxRentDuration: 0,
    paymentToken: 1,
    nftStandard: null,
    chain: "0x1",
    collectionName: "",
    collectionSymbol: "",
    nftName: "",
    nftImage: "",
    nftDesc: "",
  });

  const [showRentDetailsMenu, setShowRentDetailsMenu] = useState(false);
  const [showLendDetailsMenu, setShowLendDetailsMenu] = useState(false);
  const [img, setImg] = useState("");
  const [renter, setRenter] = useState("");
  const [itemName, setItemName] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [standard, setStandard] = useState("");
  const [mainStandard, setMainStandard] = useState("");
  const [itemAddr, setItemAddr] = useState("");
  const [mainItemAddr, setMainItemAddr] = useState("");
  const [isRentClaimed, setIsRentClaimed] = useState("");
  const [renterAddress, setRenterAddress] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [desc, setDesc] = useState("");
  const [rentTxnData, setRentTxnData] = useState("");
  const [lendTxnData, setLendTxnData] = useState("");
  const [dayPassed, setDayPassed] = useState(false);
  const [identi, setIdenti] = useState("");
  const [rentDays, setRentDays] = useState("");
  const [payToken, setPayToken] = useState("");
  const [price, setPrice] = useState("");
  const [targetTime, setTargetTime] = useState("");
  const [alreadySetTime, setAlreadySetTime] = useState(false);
  const [timerDays, setTimerDays] = useState();
  const [timerHours, setTimerHours] = useState();
  const [timerMinutes, setTimerMinutes] = useState();
  const [timerSeconds, setTimerSeconds] = useState();
  const [miniText, setMiniText] = useState(true);
  const [loadStopRent, setLoadStopRent] = useState(false);
  const [loadClaimRent, setLoadClaimRent] = useState(false);
  const [nanValue, setNanValue] = useState(false);

  const showRentDetailsModal = () => {
    setShowRentDetailsMenu(true);
  };

  const handleRentDetailsModalCancel = () => {
    setShowRentDetailsMenu(false);
    setAlreadySetTime(false);
  };

  const showLendDetailsModal = () => {
    setShowLendDetailsMenu(true);
  };

  const handleLendDetailsModalCancel = () => {
    setShowLendDetailsMenu(false);
    setAlreadySetTime(false);
  };

  const web3 = new Web3(
    Web3.givenProvider || "ws://some.local-or-remote.node:8546"
  );

  const { address, connector, isConnected } = useAccount();

  const { data: signer } = useSigner();

  const { chain: mainChain, chains } = useNetwork();

  // const collateralFreeContract = new Sylvester(signer);

  const collateralFreeContract = getRenftContract({
    deployment: DEPLOYMENT_SYLVESTER_ETHEREUM_MAINNET_V0,
    signer,
  }).claimCollateral;

  const hadaroGoerliTestContract = new Contract(
    HADARO_GOERLI_ADDRESS,
    HADARO_GOERLI_ABI,
    signer
  );

  // console.log('sax: ',lendingNfts)
  // console.log('saxon: ',rentingNfts)

  // console.log("target time: ", targetTime !== "Invalid date")

  const decodeLendingTxnData = (dataSource, topicsObj) => {
    const { topic1, topic2, topic3 } = topicsObj;

    const res = web3.eth.abi.decodeLog(
      [
        {
          indexed: false,
          internalType: "bool",
          name: "is721",
          type: "bool",
        },
        {
          indexed: true,
          internalType: "address",
          name: "lenderAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenID",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "lendingID",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint8",
          name: "maxRentDuration",
          type: "uint8",
        },
        {
          indexed: false,
          internalType: "bytes4",
          name: "dailyRentPrice",
          type: "bytes4",
        },
        {
          indexed: false,
          internalType: "uint16",
          name: "lendAmount",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "enum IResolver.PaymentToken",
          name: "paymentToken",
          type: "uint8",
        },
      ],
      dataSource,
      [topic1, topic2, topic3]
    );

    return res.lendingID;
  };

  const decodeRentTxnData = (dataSource, topicsObj) => {
    const { topic1, topic2, topic3 } = topicsObj;

    const res = web3.eth.abi.decodeLog(
      [
        {
          indexed: true,
          internalType: "address",
          name: "renterAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "lendingID",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "rentingID",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint16",
          name: "rentAmount",
          type: "uint16",
        },
        {
          indexed: false,
          internalType: "uint8",
          name: "rentDuration",
          type: "uint8",
        },
        {
          indexed: false,
          internalType: "uint32",
          name: "rentedAt",
          type: "uint32",
        },
      ],
      dataSource,
      [topic1, topic2, topic3]
    );

    return res.rentingID;
  };

  const addEllipsis = (value) => {
    if (value === null) {
      return "";
    } else {
      const firstPart = value?.slice(0, 4);
      const lastPart = value?.slice(-3);

      return firstPart + "..." + lastPart;
    }
  };

  const parseStandards = (value) => {
    if (value === "0") {
      return "E721";
    } else if (value === "1") {
      return "E1155";
    }
  };

  const nftImageAggregating = (image) => {
    let imageToDisplay;
    if (image?.includes(".")) {
      imageToDisplay = image;
    } else {
      imageToDisplay = "https://ipfs.moralis.io:2053/ipfs/" + image;
    }

    if (image?.includes("https://") || image?.includes("data:image/")) {
      imageToDisplay = image;
    } else {
      let splicer = image?.slice(7);
      imageToDisplay = "https://gateway.ipfscdn.io/ipfs/" + splicer;
    }

    return imageToDisplay;
  };

  const uploadImage = async (e) => {
    const selectedFile = e.target.files[0];

    // console.log('seas', selectedFile)
    const fileTypes = ["image/jpeg", "image/png", "image/svg"];
    if (!isConnected) {
      message.error("Connect wallet to proceed!");
    } else {
      if (fileTypes.includes(selectedFile.type)) {
        client.assets
          .upload("image", selectedFile, {
            contentType: selectedFile.type,
            filename: selectedFile.name,
          })
          .then(async (data) => {
            // console.log(data.url)
            const document = {
              _type: "walletAvatarData",
              walletAddress: address,
              walletAvatar: data.url,
            };

            const response = await axios.post(
              `/api/postUserAvatarData`,
              document
            );

            // console.log('rest', response)
            if (response.data.msg === "success") {
              message.info("image upload success");

              //  const imgUrl = sortCorsImage(data.url)
              setAvatarAsset(data);
              reloadUserAvatar();
            }
          });
      } else {
        message.error("unsupported image type!");
      }
    }
  };


  const updateCount = async () => {
    try {
      const collectionAddr = '0x2b9732bcf1e37a09ac4a578ed442f04e3e8f2d44';
      // const collectionAddr = nftAddres
      const getCollection = await axios.get(`/api/fetchItemCollection`, {
        collectionAddr,
      });

      //  console.log('original col: ', getCollection.data)

       const filterDraftsandCol = getCollection.data.filter(
        (item) => !item._id?.includes("drafts") && item.collectionAddress === collectionAddr
      );
      // console.log('filter col: ', filterDraftsandCol)

      const itemId = filterDraftsandCol[0]?._id;
  
      const itemCount = filterDraftsandCol[0]?.itemCount;
      // console.log('item count: ', itemCount)
      // console.log('item id: ', itemId)

      let finalValue;


      if (itemCount === null) {
        finalValue = 0;
      } else {
        finalValue = Number(itemCount);
      }

  
      const valueToSend = String(finalValue - 1);
      console.log('final: ', valueToSend)
  
      if (valueToSend === "-1") {
        const count = "0";
  
        const patchItem = await axios.post(`/api/updateCollectionItemCount`, {
          itemId,
          count,
        });
        console.log('res0: ', patchItem.data)
      } else {
        const count = valueToSend;
        const patchItem = await axios.post(`/api/updateCollectionItemCount`, {
          itemId,
          count,
        });
  
        console.log('res1: ', patchItem.data)
      }

    } catch (error) {
      console.error(error)
    }
  }

  const handleRemoveElement = (position) => {
    // window.alert(position)
    // console.log(lendingNfts)
    return lendingNfts.splice(position, 1);
    // setLendingNfts(newArr)
  };

  const convertMetadata = (index) => {
    let meta = JSON.parse(ownedNfts[index]?.metadata);
    return meta?.name;
  };

  const handleLenderRentPatch = async (
    identity,
    renterAddr,
    rentClaimedStatus,
    itemStatus,
    itemTxnType
  ) => {
    try {
      const statusChange = await axios.put(`/api/updateLenderRentStatus`, {
        identity,
        renterAddr,
        rentClaimedStatus,
        itemStatus,
        itemTxnType,
      });

      // console.log('nfts patch result: ', statusChange.data)
    } catch (err) {
      // console.error(err);
    }
  };

  const handleRentPatch = async (identity, renterAddr) => {
    try {
      const statusChange = await axios.put(`/api/updateRentStatus`, {
        identity,
        renterAddr,
      });

      // console.log('nfts patch result: ', statusChange.data)
    } catch (err) {
      // console.error(err);
    }
  };

  const handlePatch = async (iden, type, status) => {
    try {
      const allNfts = await axios.put(`/api/updateNftTxnType`, { iden, type });

      // console.log('nfts patch result: ', allNfts.data)

      const statusChange = await axios.put(`/api/updateNftStatus`, {
        iden,
        status,
      });

      // console.log('nfts patch result: ', statusChange.data)
    } catch (err) {
      // console.error(err);
    }
  };

  const getLendingIdForNft = async (transactionHash, chain) => {
    const config = {
      headers: {
        accept: "application/json",
        "X-API-Key": moralisApiKey,
      },
    };

    try {
      const transactionLogs = await axios.get(
        `https://deep-index.moralis.io/api/v2/transaction/${transactionHash}/verbose?chain=${chain}`,
        config
      );

      // console.log('data: ', transactionLogs.data?.logs[0])

      const mainLog = transactionLogs.data?.logs[0];

      const dataToDecode = mainLog?.data;

      const topicsObj = {
        topic1: mainLog?.topic1,
        topic2: mainLog?.topic2,
        topic3: mainLog?.topic3,
      };

      const result = decodeLendingTxnData(dataToDecode, topicsObj);

      // console.log('topics: ', topicsObj)

      // const queryNft = `
      // query LendingsQuery {
      //     lendings (where: {nftAddress: "${tokenAddr}", tokenID: "${tokenID}"}) {
      //       id
      //       tokenID
      //     }
      //   }`;

      // const urqlClient = createClient({
      //   url: SYLVESTER_SUBGRAPH_URL,
      // });

      // const response = await urqlClient.query(queryNft).toPromise();

      // const result = response.data;

      // console.log(result)

      return result;
    } catch (e) {
      // console.error(e);
    }
  };

  const getRentingId = async (transactionHash, chain) => {
    const config = {
      headers: {
        accept: "application/json",
        "X-API-Key": moralisApiKey,
      },
    };

    try {
      const transactionLogs = await axios.get(
        `https://deep-index.moralis.io/api/v2/transaction/${transactionHash}/verbose?chain=${chain}`,
        config
      );

      // console.log('data: ', transactionLogs.data?.logs[1])

      const mainLog = transactionLogs.data?.logs[1];

      const dataToDecode = mainLog?.data;
      // web3.utils.hexToNumber(mainLog?.topic3);
      const topicsObj = {
        // topic1: mainLog?.topic1,
        // topic2: mainLog?.topic2,
        topic3: web3.utils.hexToNumber(mainLog?.topic3),
      };

      // console.log("datatopics: ", topicsObj);
      const result = topicsObj?.topic3;
      // const result = decodeRentTxnData(dataToDecode, topicsObj);
      // console.log("dataresult: ", result);
      return result;
    } catch (e) {
      // console.error(e);
    }
  };

  const handleClaimRent = async () => {
    try {
      setLoadClaimRent(true);

      const lendingID = await getLendingIdForNft(lendTxnData, "goerli");
      const rentingID = await getRentingId(rentTxnData, "goerli");

      const rentingIDToString = String(rentingID);

      // console.log("rnt", rentingID);
      // console.log("lnt", lendingID)
      if (mainChain?.name !== "Goerli") {
        message.error("Please Connect to the Goerli Network to proceed", [3]);
        setLoadClaimRent(false);
      } else {
        const whatToSend = {
          mainStandard,
          mainItemAddr,
          tokenId,
          lendingID,
          rentingIDToString,
        };

        // console.log("txnpayload", whatToSend);

        const txn = await hadaroGoerliTestContract.claimRent(
          [mainStandard],
          [mainItemAddr],
          [tokenId],
          [lendingID],
          [rentingID]
        );

        const receipt = await txn.wait();

        // console.log(receipt)
        // 0x9d91778c5e5f506701482ee59ca9668d16d308ae6deafb7d87c1fd90ac290b2f
        if (receipt.blockNumber !== null && receipt.confirmations > 0) {
          const newRenterAddress = "";
          await handleLenderRentPatch(
            identi,
            newRenterAddress,
            "already claimed",
            "non-available",
            "previousListed for lending"
          );
          await getColandUpdateItemCount(mainItemAddr);
          message.success("successfully claimed rental fees!");
          handleLendDetailsModalCancel();
          await getNewListFunc();
          await getWalletNfts();
        }
      }
      setLoadClaimRent(false);
    } catch (e) {
      // console.warn(e) 
      if (e.code === "ACTION_REJECTED") {
        setLoadClaimRent(false);
        message.error("user rejected transaction");
      } else if (e.message[0] === "F") {
        setLoadClaimRent(false);
        message.error("something went wrong");
      } else if(e.error.data.message === "execution reverted: Hadaro::zero address"){
        await handlePatch(
          identi,
          "previousListed for lending",
          "non-available"
        );
        await getColandUpdateItemCount(mainItemAddr);
        message.success("item already being returned to your wallet, removing from lendings...", [5]);
        handleLendDetailsModalCancel();
        await getNewListFunc();
        await getWalletNfts();
        setLoadClaimRent(false);
      }
    }
  };

  const handleStopRent = async () => {
    try {
      // message.error('tf')
      // console.log('gfkdvdvb')
      setLoadStopRent(true);

      const lendingID = await getLendingIdForNft(lendTxnData, "goerli");
      const rentingID = await getRentingId(rentTxnData, "goerli");

      const rentingIDToString = String(rentingID);

      // console.log("rnt", rentingID);
      // console.log("lnt", lendingID)
      if (mainChain?.name !== "Goerli") {
        message.error("Please Connect to the Goerli Network to proceed", [3]);
        setLoadStopRent(false);
      } else {
        const whatToSend = {
          mainStandard,
          mainItemAddr,
          tokenId,
          lendingID,
          rentingIDToString,
        };

        // console.log("txnpayload", whatToSend);
        const txn = await hadaroGoerliTestContract.stopRent(
          [mainStandard],
          [mainItemAddr],
          [tokenId],
          [lendingID],
          [rentingID]
        );

        const receipt = await txn.wait();

        // console.log(receipt)
        // 0x9d91778c5e5f506701482ee59ca9668d16d308ae6deafb7d87c1fd90ac290b2f
        if (receipt.blockNumber !== null && receipt.confirmations > 0) {
          const newRenterAddress = "";
          if (dayPassed) {
            await handleRentPatch(identi, newRenterAddress);
            await handlePatch(
              identi,
              "previousListed for lending",
              "non-available"
            );
            await getColandUpdateItemCount(mainItemAddr);
          } else {
            await handleRentPatch(identi, newRenterAddress);
            await handlePatch(
              identi,
              "previousListed for lending",
              "non-available"
            );
            await getColandUpdateItemCount(mainItemAddr);
          }
          // await getColandUpdateItemCount(nftAddress);
          // await handleRemoveElement(position);
          message.success("successfully stopped rent of NFT!");
          getRentingNfts();
        }
      }
      setLoadStopRent(false);
    } catch (e) {
      // console.warn(e);
      if (e.message[0] === "u" && e.message[1] === "s") {
        message.error("user rejected transaction");
        setLoadStopRent(false);
      } else if (e.message[0] === "F") {
        message.error("something went wrong");
        setLoadStopRent(false);
      } else if (
        e.error.data.message === "execution reverted: Hadaro::past return date"
      ) {
        message.error("You failed to return item before expiry!");
        const newRenterAddress = "" 
        await handleRentPatch(identi, newRenterAddress);
        setLoadStopRent(false);
        await getRentingNfts()
      } else if(e.error.data.message === "execution reverted: Hadaro::zero address"){
        await handlePatch(
          identi,
          "previousListed for lending",
          "non-available"
        );
        await getColandUpdateItemCount(mainItemAddr);
        message.success("item already returned to your wallet, removing from lendings...", [5]);
        handleLendDetailsModalCancel();
        setLoadStopRent(false);
        await getNewListFunc();
        await getWalletNfts();
      }
    }
  };

  // const prepareStopRent = async(position) => {
  //   try {
  //     setLoadingRentRemove(true)
  //   const objToLook = rentingNfts[position]
  //   // console.log('prep up', objToLook)

  //   const tokenAddr = objToLook?.nftAddress
  //   const tokenID = objToLook?.tokenID
  //   const nftStandard = objToLook?.nftStandard
  //   const nftAddress = objToLook?.nftAddress
  //   const iden = objToLook?._id
  //   const status = objToLook?.status

  //   const res = await getLendingIdForNft(tokenAddr, tokenID)

  //   console.log('id', res.lendings[0].id)

  //   const lendingID = res.lendings[0].id

  //     if (mainChain?.name !== "Ethereum") {
  //       message.error("Please Connect to the Ethereum Network to proceed", [3]);
  //       setLoadingLendRemove(false)
  //     } else {

  //       if (status === "in rent") {

  //       }

  //          const txn = await collateralFreeContract.stopLending(
  //       [nftStandard],
  //       [nftAddress],
  //       [tokenID],
  //       [lendingID],
  //     );

  //     const receipt = await txn.wait()

  //     if(receipt) {
  //       message.success('successfully stopped rent of NFT!')
  //       handleRemoveElement(position)
  //       await handlePatch(iden, "lending")
  //       getNewListFunc()
  //     }
  //     }
  //     setLoadingRentRemove(false)
  //       //  handleRemoveElement(position)
  //       //   await handlePatch(iden)
  //       //  getNewListFunc()

  //   } catch (error) {
  //     setLoadingLendRemove(false)
  //     console.error(error)
  //   }

  // }

  const getColandUpdateItemCount = async (collectionAddr) => {
    // const collectionAddr = "0x999e88075692bCeE3dBC07e7E64cD32f39A1D3ab"
    const getCollection = await axios.post(`/api/fetchItemCollection`, {
      collectionAddr,
    });

    const filterDrafts = getCollection.data.filter(
      (item) =>
        item.collectionAddress.toLowerCase() === collectionAddr.toLowerCase() &&
        !item._id?.includes("drafts")
    );
    // console.log('results: ', getCollection.data)
    // console.log('results: ', filterDrafts)

    const itemId = filterDrafts[0]?._id;

    const itemCount = filterDrafts[0]?.itemCount;
    // console.log('results: ', itemCount)

    let finalValue;

    if (itemCount === null) {
      finalValue = 0;
    } else {
      finalValue = Number(itemCount);
    }

    const valueToSend = String(finalValue - 1);
    // console.log('final: ', valueToSend)

    if (valueToSend === "-1") {
      const count = "0";

      const patchItem = await axios.post(`/api/updateCollectionItemCount`, {
        itemId,
        count,
      });
      // console.log('res0: ', patchItem.data)
    } else {
      const count = valueToSend;
      const patchItem = await axios.post(`/api/updateCollectionItemCount`, {
        itemId,
        count,
      });

      // console.log('res1: ', patchItem.data)
    }
  };

  const showLendingDetails = (position) => {
    const lendItem = lendingNfts[position];
    // console.log('lenditem', lendItem)

    setImg(nftImageAggregating(lendItem?.metadataImage));
    setRenter(addEllipsis(lendItem?.renterAddress));
    setStandard(parseStandards(lendItem?.nftStandard));
    setMainStandard(lendItem?.nftStandard);
    setItemAddr(addEllipsis(lendItem?.nftAddress));
    setMainItemAddr(lendItem?.nftAddress);
    setItemName(lendItem?.metadataName);
    setTokenId(lendItem?.tokenID);
    setDesc(lendItem?.metadataDesc);
    setRentTxnData(lendItem?.rentTransactionHash);
    setLendTxnData(lendItem?.lendTransactionHash);
    setIdenti(lendItem?._id);
    setIsRentClaimed(lendItem?.isRentClaimed);
    setRenterAddress(lendItem?.renterAddress);
    setTransactionType(lendItem?.transactionType);

    const noOfRentDays = lendItem?.noOfRentDays;
    const timeRented = lendItem?.timeOfRent;

    const formattedExpiry = moment(timeRented)
      .add(noOfRentDays, "days")
      .format();

    setTargetTime(formattedExpiry);
    setAlreadySetTime(true);
    // console.log("prep up", lendItem);
    showLendDetailsModal();
  };

  const prepareStopLend = async () => {
    try {
      setLoadingLendRemove(true);
      // const objToLook = lendingNfts[position];
      // // console.log('prep up', objToLook)

      // const tokenAddr = objToLook?.nftAddress;
      // const tokenID = objToLook?.tokenID;
      // const nftStandard = objToLook?.nftStandard;
      // const nftAddress = objToLook?.nftAddress;
      // const iden = objToLook?._id;
      // const transactionHash = objToLook?.lendTransactionHash;

      // console.log('hash', transactionHash)

      const lendingID = await getLendingIdForNft(lendTxnData, "goerli");

      // console.log("id", lendingID);

      //     const lendingID = res.lendings[0].id;

      if (mainChain?.name !== "Goerli") {
        message.error("Please Connect to the Goerli Network to proceed", [3]);
        setLoadingLendRemove(false);
      } else {
        const mst = {
          mainStandard,
          mainItemAddr,
          tokenId,
          lendingID,
        };

        // console.log('cdf', mst)

        const txn = await hadaroGoerliTestContract.stopLend(
          [mainStandard],
          [mainItemAddr],
          [tokenId],
          [lendingID]
        );

        const receipt = await txn.wait();

        // console.log(receipt)

        if (receipt.blockNumber !== null && receipt.confirmations > 0) {
          //  const nftadfr = "0x999e88075692bcee3dbc07e7e64cd32f39a1d3ab"
          //  const iden = "7Fr0FUO69KxDBqVkyLHEmB"
          // const response = await axios.get(`/api/fetchAllNftsInCollection`)
          // console.log('hjs: ', response.data)
          await handlePatch(
            identi,
            "previousListed for lending",
            "non-available"
          );
          await getColandUpdateItemCount(mainItemAddr);
          message.success("successfully stopped lend of NFT!");
          handleLendDetailsModalCancel();
          await getNewListFunc();
          await getWalletNfts();
        }
      }
      setLoadingLendRemove(false);
    } catch (e) {
      // console.error(e.error.message);
      if (e.code === "ACTION_REJECTED") {
        message.error("user rejected transaction");
        setLoadingLendRemove(false);
      } else if (e.message[0] === "F") {
        message.error("something went wrong");
        setLoadingLendRemove(false);
      } else if(e.error.message === "execution reverted: Hadaro::zero address"){
        await handlePatch(
          identi,
          "previousListed for lending",
          "non-available"
        );
        await getColandUpdateItemCount(mainItemAddr);
        message.success("item already returned to your wallet, removing from lendings...", [5]);
        handleLendDetailsModalCancel();
        setLoadingLendRemove(false);
        await getNewListFunc();
        await getWalletNfts();
      }  else if (e.error.message === "execution reverted: Hadaro::actively rented") {
        message.error("Unable to perform action! rental is in progress...")
        setLoadingLendRemove(false);
      }
    }
  };

  // console.log('owned', ownedNfts)

  let interval;

  const startTimer = () => {
    const countDown = new Date(targetTime).getTime();

    interval = setInterval(() => {
      const now = new Date().getTime();

      const diff = countDown - now;

      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const hours = Math.floor(
        (diff % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (1000 * 60));
      const seconds = Math.floor((diff % (60 * 1000)) / 1000);

      // console.log('diff', isNaN(diff))
      if (isNaN(diff) === true) {
        setNanValue(true);
      }

      if (diff <= 0 || isNaN(diff) === true) {
        clearInterval(interval.current);
      } else {
        setTimerDays(days);
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    });
  };

  const handleRemoveFromRent = async () => {
    try {
      const newRenterAddress = "";
      const dataSend = await handleRentPatch(identi, newRenterAddress);
      // console.log('data ', identi)
      message.success("successfully removed!");
      handleRentDetailsModalCancel();
      getRentingNfts();
    } catch (e) {
      // console.error(e);
    }
  };

  const handleViewRentDetails = (position) => {
    const rentItem = rentingNfts[position];
    setImg(nftImageAggregating(rentItem?.metadataImage));
    setRenter(addEllipsis(rentItem?.renterAddress));
    setStandard(parseStandards(rentItem?.nftStandard));
    setMainStandard(rentItem?.nftStandard);
    setItemAddr(addEllipsis(rentItem?.nftAddress));
    setMainItemAddr(rentItem?.nftAddress);
    setItemName(rentItem?.metadataName);
    setTokenId(rentItem?.tokenID);
    setDesc(rentItem?.metadataDesc);
    setRentTxnData(rentItem?.rentTransactionHash);
    setLendTxnData(rentItem?.lendTransactionHash);
    setIdenti(rentItem?._id);

    const noOfRentDays = rentItem?.noOfRentDays;
    const timeRented = rentItem?.timeOfRent;
    const expiryDate = noOfRentDays * 24 * 60 * 60 + timeRented;

    const singleDay = 24 * 60 * 60 * 1000;

    const isSingleDayPassed = Date.now() - timeRented > singleDay;

    // console.log('check', isSingleDayPassed)

    if (isSingleDayPassed) {
      setDayPassed(true);
    }

    const formattedExpiry = moment(timeRented)
      .add(noOfRentDays, "days")
      .format();
    const formattedStartDate = moment(timeRented).format();

    const eventTime = new Date(formattedExpiry).getTime();

    // moment.duration(targetTime.diff(currentTime));

    // moment(timeRented).format("MMM Do YY");
    // moment(expiryDate).format("MMM Do YY");

    setTargetTime(formattedExpiry);
    setAlreadySetTime(true);
    // console.log('rent dets', rentItem);
    // console.log('start date: ', formattedStartDate)
    // console.log("end date: ", formattedExpiry);
    // console.log('timeRemaining ', eventTime)
    showRentDetailsModal();
  };

  useEffect(() => {
    if (targetTime !== "" || targetTime !== "Invalid date") {
      startTimer();
    }
  }, [alreadySetTime]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.caption}>
        <h1>PORTFOLIO</h1>
      </div>

      <div className={styles.mainComp}>
        <div className={styles.mainCompInner}>
          <div className={styles.imgPart}>
            {!isConnected ? (
              <div className={styles.waitingPart}>
                {" "}
                <p>connect wallet to view</p>
              </div>
            ) : avatarLoading ? (
              <div className={styles.waitingPart}></div>
            ) : userAvatar?.length === 0 ? (
              <div className={styles.formUpperImageContainer}>
                <label
                  className={styles.formUpperImageDiv}
                  htmlFor="imagefiles"
                >
                  {avatarAsset !== null ? (
                    <img
                      src={avatarAsset?.url}
                      alt="image"
                      cross-origin="use-credentials"
                      className={styles.imgUpload}
                    />
                  ) : (
                    <p>upload avatar</p>
                  )}
                </label>
                <input
                  id="imagefiles"
                  type="file"
                  onChange={(e) => {
                    setAvatarFile(e.target.files[0]);
                    uploadImage(e);
                  }}
                />
              </div>
            ) : (
              <img
                src={userAvatar[0]?.walletAvatar}
                alt="avatar"
                cross-origin="use-credentials"
                className={styles.avatarPart}
              />
            )}
          </div>
          {userAvatar?.length > 0 && (
            <div className={styles.changeAvatar}>
              <label htmlFor="imagefile">
                <p>Change avatar</p>
              </label>
              <input
                id="imagefile"
                type="file"
                onChange={(e) => {
                  setAvatarFile(e.target.files[0]);
                  uploadImage(e);
                }}
              />
            </div>
          )}
          <div className={styles.lowerPart}>
            <div className={styles.menuItem}>
              <div className={styles.menuItemTop}>
                <img
                  className={styles.menuItemImage}
                  src={`${
                    openLend ? "/images/minus.png" : "/images/cross.png"
                  }`}
                  alt=""
                  onClick={() => {
                    setOpenLend((prev) => !prev);
                  }}
                />
                <p className={styles.menuItemText}>Lending</p>
              </div>
              <div
                className={
                  openLend ? styles.dropdownmenu : styles.dropdownmenuinactive
                }
              >
                <div className={styles.subdropmenu}>
                  {walletConnectStatus ? (
                    loadingLendNfts ? (
                      <div>
                        {" "}
                        <small>Loading...</small>{" "}
                      </div>
                    ) : lendingNfts?.length == 0 ? (
                      <small>No Lending NFTs at the moment</small>
                    ) : (
                      <div className={styles.mainCover}>
                        {lendingNfts?.map((el, index) => (
                          <div key={index}>
                            <LendNfts
                              nftname={el?.metadataName}
                              nftImage={nftImageAggregating(el?.metadataImage)}
                              setLendItem={showLendingDetails}
                              // setLendItem={prepareStopLend}
                              position={index}
                              loadingLend={loadingLendRemove}
                            />
                          </div>
                        ))}
                        <Modal
                          footer={null}
                          open={showLendDetailsMenu}
                          onCancel={handleLendDetailsModalCancel}
                          className={styles.rentItemsModalCover}
                        >
                          <div className={styles.closeMenu}>
                            <CloseOutlined
                              className={styles.closeIcon}
                              onClick={handleLendDetailsModalCancel}
                            />
                          </div>
                          <div className={styles.infoContainer}>
                            <div className={styles.infoImage}>
                              <img src={img.includes('undefined') ? "/images/no-image-placeholder.png" : img } alt="item-image" />
                            </div>
                            <div className={styles.infoDesc}>
                              <div className={styles.infoDescLender}>
                                <small className={styles.gray}>Renter</small>
                                <small> {renter} </small>
                              </div>
                              <div className={styles.infoDescName}>
                                <div className={styles.infoDescMetaNames}>
                                  {/* <h3> {collectionName} </h3> */}
                                  <h2> {itemName === null ? "No name" : itemName} </h2>
                                </div>
                                <div className={styles.miniInfo}>
                                  <small> {standard} </small>
                                  {/* <small> {tokenId} </small> */}
                                  <small> {itemAddr} </small>
                                </div>
                                <div className={styles.miniDesc}>
                                  {miniText ? (
                                    <p className={styles.miniText}>
                                      {desc?.split(" ").splice(0, 15).join(" ")}
                                      {desc?.split(" ").length < 15 ? (
                                        " "
                                      ) : (
                                        <span
                                          className={styles.ctaForMore}
                                          onClick={() => setMiniText(false)}
                                        >
                                          more
                                        </span>
                                      )}
                                    </p>
                                  ) : (
                                    <p>
                                      {desc}
                                      {desc?.split(" ").length < 15 ? (
                                        " "
                                      ) : (
                                        <span onClick={() => setMiniText(true)}>
                                          less
                                        </span>
                                      )}
                                    </p>
                                  )}
                                </div>
                                {isRentClaimed === "already claimed" ||
                                isRentClaimed === null ? (
                                  ""
                                ) : (
                                  <div className={styles.timePart}>
                                    <h3>Time Remaining </h3>
                                    {timerSeconds === undefined && (
                                      <small className={styles.notifyText}>
                                        Renting for your item has ended...😮
                                      </small>
                                    )}
                                    {isRentClaimed === "not yet" &&
                                      renterAddress === "" && (
                                        <small className={styles.notifyText}>
                                          Renter returned this item...😐
                                        </small>
                                      )}
                                    <div className={styles.timePartLower}>
                                      <p>
                                        {timerDays === undefined
                                          ? "0"
                                          : timerDays}{" "}
                                        <span>Days</span>
                                      </p>
                                      <p>
                                        {timerHours === undefined
                                          ? "0"
                                          : timerHours}{" "}
                                        <span>Hours</span>
                                      </p>
                                      <p>
                                        {timerMinutes === undefined
                                          ? "0"
                                          : timerMinutes}{" "}
                                        <span>Minutes</span>
                                      </p>
                                      <p>
                                        {timerSeconds === undefined
                                          ? "0"
                                          : timerSeconds}{" "}
                                        <span>Seconds</span>
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className={styles.ctaButton}>
                                {isRentClaimed === "already claimed" &&
                                transactionType === "lending" ? (
                                  <button onClick={prepareStopLend}>
                                    {" "}
                                    {loadingLendRemove
                                      ? "Retrieving item..."
                                      : "Stop Lend"}{" "}
                                  </button>
                                ) : renterAddress === "" &&
                                  timerSeconds !== undefined ? (
                                  <button onClick={handleClaimRent}>
                                    {loadClaimRent
                                      ? "Claiming fees..."
                                      : "Claim Rental fees"}{" "}
                                  </button>
                                ) : timerSeconds === undefined ? (
                                  isRentClaimed === "not yet" ? (
                                    <button onClick={handleClaimRent}>
                                      {loadClaimRent
                                        ? "Claiming fees..."
                                        : "Claim Rental fees"}{" "}
                                    </button>
                                  ) : (
                                    <button onClick={prepareStopLend}>
                                      {" "}
                                      {loadingLendRemove
                                        ? "Retrieving item..."
                                        : "Stop Lend"}{" "}
                                    </button>
                                  )
                                ) : renterAddress === null ? (
                                  <button onClick={prepareStopLend}>
                                    {" "}
                                    {loadingLendRemove
                                      ? "Retrieving item..."
                                      : "Stop Lend"}{" "}
                                  </button>
                                ) : (
                                  <div>
                                  <button onClick={prepareStopLend}>
                                    Stop Lend
                                  </button>
                                    <button className={styles.inProg}>
                                      Rental in progress
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Modal>
                      </div>
                    )
                  ) : (
                    // (ownedNfts?.map((item, index) => {
                    // <h1 key={index}>{item.token_address}</h1>}))
                    <small>Connect your wallet to view</small>
                  )}
                  {/* { walletConnectStatus ?   <small>This shows the NFTS that are being lent</small>   : <small>Connect your wallet to view</small>}   */}
                </div>
              </div>
            </div>

            <div className={styles.menuItem}>
              <div className={styles.menuItemTop}>
                <img
                  className={styles.menuItemImage}
                  src={`${
                    openRent ? "/images/minus.png" : "/images/cross.png"
                  }`}
                  alt=""
                  onClick={() => {
                    setOpenRent((prev) => !prev);
                  }}
                />
                <p className={styles.menuItemText}>Renting</p>
              </div>
              <div
                className={
                  openRent ? styles.dropdownmenu : styles.dropdownmenuinactive
                }
              >
                <div className={styles.subdropmenu}>
                  {walletConnectStatus ? (
                    loadingRentNfts ? (
                      <div>
                        {" "}
                        <small>Loading...</small>{" "}
                      </div>
                    ) : rentingNfts?.length == 0 ? (
                      <small>No Renting NFTs at the moment</small>
                    ) : (
                      <div className={styles.mainCover}>
                        {rentingNfts?.map((el, index) => (
                          <div key={index}>
                            <RentNfts
                              nftname={el?.metadataName}
                              nftImage={nftImageAggregating(el.metadataImage).includes('undefined')?"/images/no-image-placeholder.png": nftImageAggregating(el.metadataImage)}
                              nftStatus={el.status}
                              position={index}
                              loadingRent={loadingRentRemove}
                              setRentItem={handleViewRentDetails}
                            />
                          </div>
                        ))}
                        <Modal
                          footer={null}
                          open={showRentDetailsMenu}
                          onCancel={handleRentDetailsModalCancel}
                          className={styles.rentItemsModalCover}
                        >
                          <div className={styles.closeMenu}>
                            <CloseOutlined
                              className={styles.closeIcon}
                              onClick={handleRentDetailsModalCancel}
                            />
                          </div>
                          <div className={styles.infoContainer}>
                            <div className={styles.infoImage}>
                              <img src={img.includes('undefined')? "/images/no-image-placeholder.png": img} alt="item-image" />
                            </div>
                            <div className={styles.infoDesc}>
                              <div className={styles.infoDescLender}>
                                <small className={styles.gray}>Renter</small>
                                <small> {renter} </small>
                              </div>
                              <div className={styles.infoDescName}>
                                <div className={styles.infoDescMetaNames}>
                                  {/* <h3> {collectionName} </h3> */}
                                  <h2> {itemName === null ? "No name" : itemName} </h2>
                                </div>
                                <div className={styles.miniInfo}>
                                  <small> {standard} </small>
                                  {/* <small> {tokenId} </small> */}
                                  <small> {itemAddr} </small>
                                </div>
                                <div className={styles.miniDesc}>
                                  {miniText ? (
                                    <p className={styles.miniText}>
                                      {desc?.split(" ").splice(0, 15).join(" ")}
                                      {desc?.split(" ").length < 15 ? (
                                        " "
                                      ) : (
                                        <span
                                          className={styles.ctaForMore}
                                          onClick={() => setMiniText(false)}
                                        >
                                          more
                                        </span>
                                      )}
                                    </p>
                                  ) : (
                                    <p>
                                      {desc}
                                      {desc.split(" ").length < 15 ? (
                                        " "
                                      ) : (
                                        <span onClick={() => setMiniText(true)}>
                                          less
                                        </span>
                                      )}
                                    </p>
                                  )}
                                </div>
                                <div className={styles.timePart}>
                                  <h3>Time Remaining </h3>
                                  {timerDays === undefined &&
                                    timerHours === undefined &&
                                    timerMinutes === undefined &&
                                    timerSeconds === undefined && (
                                      <small className={styles.notifyText}>
                                        Time for rentage has elapsed...😪
                                      </small>
                                    )}
                                  <div className={styles.timePartLower}>
                                    <p>
                                      {timerDays === undefined
                                        ? "0"
                                        : timerDays}{" "}
                                      <span>Days</span>
                                    </p>
                                    <p>
                                      {timerHours === undefined
                                        ? "0"
                                        : timerHours}{" "}
                                      <span>Hours</span>
                                    </p>
                                    <p>
                                      {timerMinutes === undefined
                                        ? "0"
                                        : timerMinutes}{" "}
                                      <span>Minutes</span>
                                    </p>
                                    <p>
                                      {timerSeconds === undefined
                                        ? "0"
                                        : timerSeconds}{" "}
                                      <span>Seconds</span>
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className={styles.ctaButton}>
                                <button
                                  onClick={
                                    timerDays === undefined &&
                                    timerHours === undefined &&
                                    timerMinutes === undefined &&
                                    timerSeconds === undefined
                                      ? handleRemoveFromRent
                                      : handleStopRent
                                  }
                                >
                                  {timerDays === undefined &&
                                  timerHours === undefined &&
                                  timerMinutes === undefined &&
                                  timerSeconds === undefined
                                    ? "Remove from list"
                                    : loadStopRent
                                    ? "Stopping Rent"
                                    : "Stop Rent"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </Modal>
                      </div>
                    )
                  ) : (
                    // (ownedNfts?.map((item, index) => {
                    // <h1 key={index}>{item.token_address}</h1>}))
                    <small>Connect your wallet to view</small>
                  )}
                  {/* { walletConnectStatus ?   <small>This shows the NFTS that are being rented</small>  : <small>Connect your wallet to view</small>} */}
                </div>
              </div>
            </div>

            <div className={styles.menuItem}>
              <div className={styles.menuItemTop}>
                <img
                  className={styles.menuItemImage}
                  src={`${
                    openWallet ? "/images/minus.png" : "/images/cross.png"
                  }`}
                  alt=""
                  onClick={() => {
                    setOpenWallet((prev) => !prev);
                  }}
                />
                <p className={styles.menuItemText}>My Wallet</p>
              </div>
              <div
                className={
                  openWallet ? styles.dropdownmenu : styles.dropdownmenuinactive
                }
              >
                <div className={styles.subdropmenu}>
                  {/* {loadingWallet ? (<div> <p>Loading...</p> </div>) : " " } */}
                  {walletConnectStatus ? (
                    loadingWallet ? (
                      <div>
                        {" "}
                        <small>Loading...</small>{" "}
                      </div>
                    ) : ownedNfts?.length === 0 ? (
                      <small>No NFTs in wallet</small>
                    ) : (
                      <div className={styles.mainCover}>
                        {ownedNfts?.map((el, index) => (
                          <div key={index}>
                            <WalletNfts
                              allInfo={el}
                              collectionName={el.name}
                              nftname={convertMetadata(index)}
                              nftImg={el.image}
                              metadata={el.metadata}
                              lendItemObject={currentLendItem}
                              setLendItemObject={setCurrentLendItem}
                              verifiedCollectionsArr={verifiedCollections}
                              getWalletNft={getWalletNfts}
                              getLendNfts={getNewListFunc}
                            />
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    // (ownedNfts?.map((item, index) => {
                    // <h1 key={index}>{item.token_address}</h1>}))
                    <small>Connect your wallet to view</small>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <button onClick={updateCount}>get and add to item count</button> */}
        </div>
      </div>
    </div>
  );
};

export default PortfolioComp;
