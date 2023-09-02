import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  unpackPrice,
  Sylvester,
  NFTStandard,
  packPrice,
  SYLVESTER_ADDRESS,
  getRenftContract,
  DEPLOYMENT_SYLVESTER_ETHEREUM_MAINNET_V0,
  SylvesterV0FunctionInterface,
  PaymentToken,
} from "@renft/sdk";
import {
  useAccount,
  useConnect,
  useSigner,
  useProvider,
  erc20ABI,
  useNetwork,
} from "wagmi";
import {
  WETH_GOERLI_ADDRESS,
  WETH_GOERLI_ABI,
  HADARO_GOERLI_ABI,
  HADARO_GOERLI_ADDRESS,
} from "../../constants/abis";
import { Contract, BigNumber, utils } from "ethers";
import { createClient } from "urql";
import { moralisApiKey } from "../../creds";
import axios from "axios";
import Web3 from "web3";
import moment from "moment";
import { message, Modal, Select } from "antd";
import { CloseOutlined, SyncOutlined } from "@ant-design/icons";
import ArtCard from "../ArtCard/ArtCard";
import { nftImageAggregating } from "../../utils/helpers";
import styles from "./collectioncomp.module.scss";
// import { BigNumber } from "ethers";

// const featuredData = [
//   {
//     image: "/images/ART01.png",
//     title: "Hadara #1",
//     collection: "",
//     creator: "SalvadorDali",
//     bidPrice: 4.98 + " " + "ETH",
//   },
//   {
//     image: "/images/ART02.png",
//     title: "Hadara #2",
//     collection: "",
//     creator: "SalvadorDali",
//     bidPrice: 4.98 + " " + "ETH",
//   },
//   {
//     image: "/images/ART03.png",
//     title: "Hadara #3",
//     collection: "",
//     creator: "SalvadorDali",
//     bidPrice: 4.98 + " " + "ETH",
//   },
//   {
//     image: "/images/ART04.png",
//     title: "Hadara #4",
//     collection: "",
//     creator: "SalvadorDali",
//     bidPrice: 4.98 + " " + "ETH",
//   },
//   {
//     image: "/images/ART05.png",
//     title: "Hadara #5",
//     collection: "",
//     creator: "SalvadorDali",
//     bidPrice: 4.98 + " " + "ETH",
//   },
//   {
//     image: "/images/ART06.png",
//     title: "Hadara #6",
//     collection: "",
//     creator: "SalvadorDali",
//     bidPrice: 4.98 + " " + "ETH",
//   },
//   {
//     image: "/images/ART07.png",
//     title: "Hadara #7",
//     collection: "",
//     creator: "SalvadorDali",
//     bidPrice: 4.98 + " " + "ETH",
//   },
//   {
//     image: "/images/ART08.png",
//     title: "Hadara #8",
//     collection: "",
//     creator: "SalvadorDali",
//     bidPrice: 4.98 + " " + "ETH",
//   },
//   {
//     image: "/images/ART09.png",
//     title: "Hadara #9",
//     collection: "",
//     creator: "SalvadorDali",
//     bidPrice: 4.98 + " " + "ETH",
//   },
//   {
//     image: "/images/ART10.png",
//     title: "Hadara #10",
//     collection: "",
//     creator: "SalvadorDali",
//     bidPrice: 4.98 + " " + "ETH",
//   },
//   {
//     image: "/images/ART11.png",
//     title: "Hadara #11",
//     collection: "",
//     creator: "SalvadorDali",
//     bidPrice: 4.98 + " " + "ETH",
//   },
//   {
//     image: "/images/ART12.png",
//     title: "Hadara #12",
//     collection: "",
//     creator: "SalvadorDali",
//     bidPrice: 4.98 + " " + "ETH",
//   },
//   {
//     image: "/images/ART13.png",
//     title: "Hadara #13",
//     collection: "",
//     creator: "SalvadorDali",
//     bidPrice: 4.98 + " " + "ETH",
//   },
//   {
//     image: "/images/ART14.png",
//     title: "Hadara #14",
//     collection: "",
//     creator: "SalvadorDali",
//     bidPrice: 4.98 + " " + "ETH",
//   },
//   {
//     image: "/images/ART15.png",
//     title: "Hadara #15",
//     collection: "",
//     creator: "SalvadorDali",
//     bidPrice: 4.98 + " " + "ETH",
//   },
//   {
//     image: "/images/ART16.png",
//     title: "Hadara #16",
//     collection: "",
//     creator: "SalvadorDali",
//     bidPrice: 4.98 + " " + "ETH",
//   },
// ];

const CollectionItemsComp = ({
  itemsToDisplay,
  loadingItems,
  openFooter,
  getRefreshItems,
}) => {
  const { address, connector, isConnected } = useAccount();
  const { data: signer } = useSigner();

  const provider = useProvider();

  const web3 = new Web3(
    Web3.givenProvider || "ws://some.local-or-remote.node:8546"
  );

  // console.log("eluupi: ", itemsToDisplay);
  // const collateralFreeContract = new Sylvester(signer);

  const wethGoerliTestContract = new Contract(
    WETH_GOERLI_ADDRESS,
    WETH_GOERLI_ABI,
    signer
  );

  const hadaroGoerliTestContract = new Contract(
    HADARO_GOERLI_ADDRESS,
    HADARO_GOERLI_ABI,
    signer
  );

  const decodeTxnData = (dataSource, topicsObj) => {
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

    // console.log("prt", res)

    return res.lendingID;
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

      const result = decodeTxnData(dataToDecode, topicsObj);

      // console.log('topics: ', topicsObj)

      return result;
    } catch (e) {
      // console.error(e);
    }
  };

  const parseStandards = (value) => {
    if (value === "0") {
      return "E721";
    } else if (value === "1") {
      return "E1155";
    }
  };

  const { chain: mainChain, chains } = useNetwork();

  // console.log('kk', itemsToDisplay)

  const collectionDetails = useSelector((state) => state.collectionDetails);

  const { collectionInfo } = collectionDetails;

  const { colName, colSymbol, iden } = collectionInfo;
  const [rentingLoading, setRentingLoading] = useState(false);
  const [toDisplayData, setToDisplayData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRentMenu, setShowRentMenu] = useState(false);
  const [miniText, setMiniText] = useState(true);
  const [rentalPeriod, setRentalPeriod] = useState("");
  const [error, setError] = useState(null);
  const [displayAmount, setDisplayAmount] = useState(null);
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [chain, setChain] = useState("0x5");
  const [balances, setBalances] = useState([]);
  const [wethBalance, setWethBalance] = useState(0);
  const [daiBalance, setDaiBalance] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [linkBalance, setLinkBalance] = useState(0);
  const [converterModalOpen, setconverterModalOpen] = useState(false);
  const [isConverterModalOpen, setIsConverterModalOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [valueForExhange, setValueForExchange] = useState("");
  const [priceToBeConverted, setPriceToBeConverted] = useState(0);
  const [exchangeAddress, setExchangeAddress] = useState({ address: "WETH" });
  const [size, setSize] = useState("middle");
  const [conversionLoading, setConversionLoading] = useState(false);
  const [alreadyConverted, setAlreadyConverted] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [preventedApproval, setPreventedApproval] = useState(false);

  const showConverterModal = () => {
    setIsConverterModalOpen(true);
  };

  const handleConverterModalCancel = () => {
    setIsConverterModalOpen(false);
    // setconverterModalOpen(false)
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    // setIsModalOpen(false);
    setShowRentMenu(false);
    // openFooter(false);
  };

  const showRentModal = () => {
    setIsRentModalOpen(true);
  };

  const handleRentModalCancel = () => {
    setIsRentModalOpen(false);
    setDisplayAmount(null);
    setRentalPeriod("");
  };

  const getTokenBalances = async () => {
    let balancesArr = [];

    try {
      // setBalances([])
      // setWethBalance(null);
      // setDaiBalance(null);
      // setUsdcBalance(null);
      // setUsdtBalance(null);
      // setLinkBalance(null);

      const response = await axios.get(`/api/get-token-balances`, {
        params: {
          walletaddr: address,
          chain: chain,
        },
      });

      const response2 = await axios.get(`/api/get-native-balance`, {
        params: {
          walletaddr: address,
          chain: chain,
        },
      });

      // console.log("reper", response.data);
      // console.log("repert", response2.data);

      const convertedPrice = Number(response2.data.balance) / 1e18;

      setWalletBalance(convertedPrice);

      response.data?.forEach((item) => {
        balancesArr.push({
          symbol: item.symbol,
          balance: item.balance,
          decimals: item.decimals,
        });
      });

      // if (value === "1") {
      //   return "WETH";
      // } else if (value === "2") {
      //   return "DAI";
      // } else if (value === "3") {
      //   return "USDC";
      // } else if (value === "4") {
      //   return "USDT";
      // }

      const WETHBalance = balancesArr.filter((e) => e.symbol === "WETH");
      const DAIBalance = balancesArr.filter((e) => e.symbol === "DAI");
      const USDCBalance = balancesArr.filter((e) => e.symbol === "USDC");
      const USDTBalance = balancesArr.filter((e) => e.symbol === "USDT");
      const LINKBalance = balancesArr.filter((e) => e.symbol === "LINK");

      setWethBalance(WETHBalance);
      setDaiBalance(DAIBalance);
      setUsdcBalance(USDCBalance);
      setUsdtBalance(USDTBalance);
      setLinkBalance(LINKBalance);

      // console.log("wethparts", wethBalance);
      // console.log("daiparts", daiBalance);
      // console.log("usdcparts", usdcBalance);
      // console.log("usdtparts", usdtBalance);
      // console.log("linkparts", linkBalance);

      // setBalances(balancesArr)
      // console.log('balances: ', balances)
    } catch (e) {
      // console.error(e);
    }
  };

  const addEllipsis = (value) => {
    const firstPart = value?.slice(0, 4);
    const lastPart = value?.slice(-3);

    return firstPart + "..." + lastPart;
  };

  const displayNftDetails = (index) => {
    const collection = itemsToDisplay[index];

    setToDisplayData(collection);
    //  console.log('collet: ', toDisplayData)
    setIsRentModalOpen(true);
    // openFooter(true);
    // window.scrollTo(0, 100);
  };

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

  const handlePatch = async (
    identity,
    status,
    type,
    noOfRentDays,
    rentTxnHash,
    timeOfRent,
    rentClaimedStatus,
    lendingID
  ) => {
    try {
      // await axios.put(`/api/updateNftStatus`, { identity, status });

      // // console.log('nfts patch result: ', allNfts.data)

      const renterAddress = address.toLowerCase();

      const patchData = await axios.put(`/api/updateNftData`, {
        identity,
        type,
        noOfRentDays,
        timeOfRent,
        status,
        renterAddress,
        rentTxnHash,
        rentClaimedStatus,
        lendingID,
      });

      // console.log("nfts patch result: ", patchData.data);
    } catch (err) {
      // console.error(err);
    }
  };

  const setNftStandard = (value) => {
    if (value === "ERC721") {
      return NFTStandard.E721;
    }
    if (value === "ERC1155") {
      return NFTStandard.E1155;
    }
  };

  // console.log("rental pd ", rentalPeriod);



  const showTotalAmount = (value) => {
    // console.log("cyle ", value);
    const numFormat = Number(value);
    const unpackedPrice = unpackPrice(toDisplayData?.price);
    // console.log(numFormat);
    if (isNaN(numFormat) == true) {
      // message.error('you entered a non-number value')
      setError("you entered a non-number value");
      setDisplayAmount(null);
    } else if (numFormat > toDisplayData?.maxDuration) {
      // message.error('wrong stuff, too high')
      setError("max rental days exceeded");
      setDisplayAmount(null);
    } else {
      setError(null);
      setDisplayAmount((unpackedPrice * numFormat).toFixed(4));
      setRentalPeriod(value);
    }
  };

  const convertToken = (value) => {
    if (value === "1") {
      return "WETH";
    } else if (value === "2") {
      return "DAI";
    } else if (value === "3") {
      return "USDC";
    } else if (value === "4") {
      return "USDT";
    }
  };

  // const tokenConverter = () => {
  //   return (
  //   <Modal
  //   footer={null}
  //   open={isConverterModalOpen}
  //   onCancel={handleConverterModalCancel}
  //   >
  //  <h5>This is the converter</h5>
  //   </Modal>)
  // }

  const handleExchangeTokenChange = (value) => {
    setExchangeAddress({ ...exchangeAddress, address: value });
    // setExchangeAddress(value)
    // console.log(exchangeAddress)
  };

  const handleConvertToToken = async () => {
    setConversionLoading(true);
    try {
      // console.log(priceToBeConverted);

      if (
        priceToBeConverted == 0 ||
        isNaN(priceToBeConverted) === true ||
        priceToBeConverted === ""
      ) {
        message.error("enter a valid price to convert!");
        setConversionLoading(false);
      } else {
        if (exchangeAddress.address === "WETH") {
          const txn = await wethGoerliTestContract.deposit({
            value: priceToBeConverted,
          });

          const receipt = await txn.wait();

          // console.log(receipt);

          if (receipt.blockNumber !== null && receipt.confirmations > 0) {
            message.success("conversion success!");
            setPriceToBeConverted("");
            setConversionLoading(false);
            setAlreadyConverted(true);
            getTokenBalances();
            handleConverterModalCancel();
          }
        }
      }
    } catch (e) {
      // console.error(e);
      if (e.code === "ACTION_REJECTED") {
        message.error("user rejected transaction");
        setConversionLoading(false);
        handleConverterModalCancel();
      } else if (e.data.message.slice(0, 23) === "err: insufficient funds") {
        message.error("insufficient funds to process conversion");
        setConversionLoading(false);
      }
      setConversionLoading(false);
    }
  };

  const convertedPrice = (value) => {
    const numFormat = Number(value);
    const converted = numFormat * 10 ** 18;
    setPriceToBeConverted(String(converted));
  };

  const returnBalance = (value) => {
    //  const { symbol, balance, decimals } = valueObj

    //  console.log('eve1: ', value)

    if (value?.length === 0) {
      const msg = "nothing to see here";
      return msg;
    } else {
      const arr = value[0];
      const { symbol, balance, decimals } = arr;
      const concatDivisor = "1" + "e" + `${decimals}`;
      const divisorNumFormat = Number(concatDivisor);
      const actualBalance = (Number(balance) / divisorNumFormat).toFixed(4);
      return actualBalance;
    }
  };

  const processTokenApproval = async () => {
    const maxTokens = BigNumber.from("2")
      .pow(BigNumber.from("256"))
      .sub(BigNumber.from("1"));
    // console.log("max tokens: ", maxTokens);
    setApprovalLoading(true);
    try {
      const approvalTxn = await wethGoerliTestContract.approve(
        HADARO_GOERLI_ADDRESS,
        maxTokens
      );

      const receipt = await approvalTxn.wait();
      if (receipt.blockNumber !== null && receipt.confirmations > 0) {
        message.success("token approval success");
        setApprovalLoading(false);
      }
    } catch (e) {
      // console.error(e)
      if (e.code === "ACTION_REJECTED") {
        message.error("user rejected transaction");
        setPreventedApproval(true);
        setRentingLoading(false);
      }
      setApprovalLoading(false);
    }
  };

  const rentContractCallAndDBPatch = async (
    nftStandard,
    nftAddress,
    tokenID,
    lendingID,
    rentDuration,
    rentAmount,
    identity
  ) => {
    setRentingLoading(true);
    // console.log("gart", rentAmount)
    try {
      const txn = await hadaroGoerliTestContract.rent(
        [nftStandard],
        [nftAddress],
        [tokenID],
        [lendingID],
        [rentDuration],
        [rentAmount]
      );

      const receipt = await txn.wait();

      // console.log(receipt);

      if (receipt.blockNumber !== null && receipt.confirmations > 0) {
        const rentTxnHash = receipt.transactionHash;
        await handlePatch(
          identity,
          "in rent",
          "lending renting",
          rentDuration,
          rentTxnHash,
          moment(Date.now()).unix(),
          "not yet",
          lendingID
        );
        // console.log(finalObj)
        setRentingLoading(false);
        setRentalPeriod("");
        handleCancel();
        message.success("rent success!");
        // message.success("rent operation in progress! your item will be displayed once confirmed on blockchain");
        getRefreshItems();
        // handleCancel();
        handleRentModalCancel();
      }
    } catch (e) {
      console.warn(e);
      // console.log(e.error.data.message)
      setRentingLoading(false);
      if (e.code === "ACTION_REJECTED") {
        message.error("user rejected transaction");
        setRentingLoading(false);
      }
      if (
        (e.error.data.message = "execution reverted: Hadaro::cant rent own nft")
      ) {
        message.error("can't rent own item!");
        setRentingLoading(false);
      } else {
        message.error("something went wrong...");
        setRentingLoading(false);
      }
    }
  };

  const handleCompleteRent = async () => {
    // console.log("display: ", toDisplayData);
    try {
      setRentingLoading(true);
      if (isConnected) {
        if (mainChain?.name !== "Goerli") {
          message.error("Please Connect to the Goerli Network to proceed", [3]);
          setRentingLoading(false);
        } else {
          if (rentalPeriod === "") {
            message.info("set a rental period then proceed to renting");
            setRentingLoading(false);
          } else {
            // console.log("styer", toDisplayData?.paymentToken);
            // console.log("styarz", wethBalance);
            if (toDisplayData?.paymentToken === "1") {
              const balanceOfToken = returnBalance(wethBalance);
              const token = "wrapped ether";
              if (balanceOfToken === "nothing to see here") {
                message.error(`you do not possess ${token} in your wallet`);
                // handleCancel()
                setRentingLoading(false);
                showConverterModal();
                // tokenConverter()
              } else {
                if (Number(displayAmount) > balanceOfToken) {
                  message.error(`you do not possess enough ${token} to 
                 rent this item`);
                  //  handleCancel()
                  showConverterModal();
                  setRentingLoading(false);
                  //  tokenConverter()
                } else {
                  // message.success("ride on to rent amigo!");
                  const transactionHash = toDisplayData?.lendTransactionHash;

                  let lendingID = toDisplayData?.lendingID;

                  if (!lendingID) {
                    lendingID = await getLendingIdForNft(
                      transactionHash,
                      "goerli"
                    );
                    // console.log('id: ', lendingID)
                  }

                  const nftStandard = Number(toDisplayData?.nftStandard);
                  const nftAddress = toDisplayData?.nftAddress.toLowerCase();

                  const identity = toDisplayData?._id;

                  // console.log('iden of data: ', identity)

                  const rentDuration = Number(rentalPeriod);
                  const tokenID = toDisplayData?.tokenID;
                  const rentAmount = 1;
                  const rentTxnHash = toDisplayData?.rentTxnHash;

                  // const finalObj = {
                  //   nftAddress,
                  //   nftStandard,
                  //   tokenID,
                  //   lendingID,
                  //   rentDuration,
                  //   rentAmount,
                  // };
                  // execution reverted: Hadaro::rentAmount is zero   execution reverted: Hadaro::invalid rent amount

                  // const msgValue = String(0);

                  // console.log("values to be passed: ", finalObj);

                  const checkAllowance = await wethGoerliTestContract.allowance(
                    address,
                    HADARO_GOERLI_ADDRESS
                  );

                  const convHex = web3.utils
                    .toBN(checkAllowance._hex)
                    .toString();

                  // console.log('allowe res: ', convHex)

                  // web3.utils.toBN(number)

                  if (convHex === "0") {
                    // console.log('yes1')
                    // setRentingLoading(false)
                    await processTokenApproval();
                    if (!preventedApproval) {
                      await rentContractCallAndDBPatch(
                        nftStandard,
                        nftAddress,
                        tokenID,
                        lendingID,
                        rentDuration,
                        rentAmount,
                        rentTxnHash
                      );
                    } else {
                      setRentingLoading(false);
                    }
                  } else if (convHex > 1) {
                    // console.log('yes2')
                    // setRentingLoading(true)
                    await rentContractCallAndDBPatch(
                      nftStandard,
                      nftAddress,
                      tokenID,
                      lendingID,
                      rentDuration,
                      rentAmount,
                      identity,
                      rentTxnHash
                    );
                  }

                  // const txn = await hadaroGoerliTestContract.rent(
                  //   [nftStandard],
                  //   [nftAddress],
                  //   [tokenID],
                  //   [lendingID],
                  //   [rentDuration],
                  //   [rentAmount],
                  // );

                  // const receipt = await txn.wait();

                  // // console.log(receipt);

                  // if (receipt.blockNumber !== null && receipt.confirmations > 0) {
                  //   await handlePatch(
                  //     identity,
                  //     "in rent",
                  //     "renting",
                  //     rentDuration,
                  //     Date.now()
                  //   );
                  //   // console.log(finalObj)
                  //   setRentingLoading(false);
                  //   setRentalPeriod("");
                  //   getRefreshItems();
                  //   handleCancel();
                  //   message.success("rent success!");
                  //   handleCancel();
                  // }
                  // setRentingLoading(false);
                }
              }
            }

            // const nftAddress = toDisplayData?.nftAddress.toLowerCase();
            // const tokenID = toDisplayData?.tokenID;
            // //       const identity = toDisplayData?._id;
            // // const lendingID = "1"; // this information is pulled from the subgraph
            // const rentDuration = rentalPeriod; // in days
            // //       const decimals = 18;

            // // // const amount= BigNumber.from(1).mul(BigNumber.from(10).pow(decimals));
            // const rentAmount = 1;

            // const resp = await getLendingIdForNft(nftAddress, tokenID);

            // //  console.log('vbb', resp)
            // const lendingID = resp.lendings[0]?.id;

            // // console.log('head', lendingID)

            // // const finalObj = {
            // //   nftStandard,
            // //   nftAddress,
            // //   tokenID,
            // //   rentDuration,
            // //   rentAmount,
            // //   lendingID
            // // }
          }
        }
      } else {
        message.error("Oops!, connect your wallet to continue");
        setRentingLoading(false);
      }
    } catch (e) {
      console.warn(e);
      if (e.reason === "execution reverted: SafeERC20: low-level call failed") {
        message.error(
          "You do not have enough funds to pay rental fees for this item!",
          [8]
        );
      } else if (e.reason === "execution reverted: Hadaro::cant rent own nft") {
        message.error("You can't rent an item you own!", [3]);
        setRentingLoading(false);
      } else if (e.code === "ACTION_REJECTED") {
        message.error("user rejected transaction");
        setRentingLoading(false);
      }
      setRentingLoading(false);
      handleCancel();
    }
  };

  useEffect(() => {
    getTokenBalances();
  }, [alreadyConverted, address, mainChain]);

  useEffect(() => {
    getTokenBalances();
  }, []);

  // const fetchCollectionNfts = async() => {
  //   try {

  //     const contractAddr = iden
  //     const response = await axios.get(`/api/fetchAllNftsInCollection`, {contractAddr})

  //     console.log('resti: ', response.data)

  //   } catch(err) {
  //     console.error(err)
  //   }
  // }

  // useEffect(() => {
  //   fetchCollectionNfts()
  // }, [])

  return (
    <div className={styles.mainContainer}>
      <div className={styles.caption}>
        <h1>
          {" "}
          {colName} {`(${colSymbol})`}{" "}
        </h1>
      </div>

      <div className={styles.mainPart}>
        <h2>COLLECTION ITEMS</h2>
        {loadingItems ? (
          <div className={styles.loadingPart}>
            <h1>{"Loading Items...."}</h1>
          </div>
        ) : itemsToDisplay?.length === 0 ? (
          <div className={styles.loadingPart}>
            <h1> No items available for this collection😶... </h1>
          </div>
        ) : (
          <div className={styles.artPart}>
            {itemsToDisplay?.map((item, index) => (
              <div key={index}>
                <ArtCard
                  image={nftImageAggregating(item?.metadataImage)}
                  title={item?.metadataName}
                  collectionName={colName}
                  bidPrice={`${unpackPrice(item.price)}`}
                  paymentToken={convertToken(item.paymentToken)}
                  status={item.transactionType}
                  identity={item._id}
                  description={item.metadataDesc}
                  position={index}
                  openRentModal={displayNftDetails}
                  openFinalModal={showRentModal}
                />
                <>
                  <Modal
                    open={isRentModalOpen}
                    footer={null}
                    onCancel={handleRentModalCancel}
                    className={styles.rentModalCover}
                  >
                    <div className={styles.closeMenu}>
                      <CloseOutlined
                        className={styles.closeIcon}
                        onClick={handleRentModalCancel}
                      />
                    </div>
                    <div className={styles.infoContainer}>
                      <div className={styles.infoImage}>
                        <img
                          src={
                            nftImageAggregating(
                              toDisplayData?.metadataImage
                            ).includes("undefined")
                              ? "/images/no-image-placeholder.png"
                              : nftImageAggregating(
                                  toDisplayData?.metadataImage
                                )
                          }
                          alt={toDisplayData?.metadataName}
                        />
                      </div>
                      <div className={styles.infoDesc}>
                        <div className={styles.infoDescLender}>
                          <small className={styles.gray}>Lender</small>
                          <small>
                            {" "}
                            {addEllipsis(toDisplayData?.lenderAddress)}{" "}
                          </small>
                        </div>
                        <div className={styles.infoDescName}>
                          <div className={styles.infoDescMetaNames}>
                            <h3> {colName} </h3>
                            <h2>
                              {" "}
                              {toDisplayData?.metadataName === null
                                ? "No Name"
                                : toDisplayData?.metadataName}{" "}
                            </h2>
                          </div>
                          <div className={styles.miniInfo}>
                            <small>
                              {" "}
                              {parseStandards(toDisplayData?.nftStandard)}{" "}
                            </small>
                            <small>
                              {" "}
                              {addEllipsis(toDisplayData?.nftAddress)}{" "}
                            </small>
                          </div>
                          <div className={styles.miniDesc}>
                            {miniText ? (
                              <p className={styles.miniText}>
                                {toDisplayData?.metadataDesc
                                  ?.split(" ")
                                  .splice(0, 15)
                                  .join(" ")}
                                <span
                                  className={styles.ctaForMore}
                                  onClick={() => setMiniText(false)}
                                >
                                  more
                                </span>{" "}
                              </p>
                            ) : (
                              <p>
                                {toDisplayData?.metadataDesc}
                                <span onClick={() => setMiniText(true)}>
                                  less
                                </span>{" "}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className={styles.formFillPart}>
                          <h3>
                            {" "}
                            Max Duration in Days{" "}
                            <span> {toDisplayData?.maxDuration} </span>{" "}
                          </h3>

                          <div className={styles.formFillPartInput}>
                            <input
                              type="text"
                              value={rentalPeriod}
                              placeholder="Set Rental Period"
                              onChange={(e) => {
                                showTotalAmount(e.target.value);
                              }}
                            />
                            {error !== null && (
                              <p className={styles.formErorPart}> {error} </p>
                            )}
                          </div>
                          <div className={styles.dailyPricePart}>
                            <h3>Daily Price </h3>{" "}
                            <h1>
                              {unpackPrice(toDisplayData?.price)}{" "}
                              {convertToken(toDisplayData?.paymentToken)}{" "}
                            </h1>
                          </div>
                          <div className={styles.finalAmountPart}>
                            <p>Amount: </p>
                            <div className={styles.finalAmountContainer}>
                              <h1>
                                {displayAmount === null ? 0 : displayAmount}{" "}
                              </h1>{" "}
                              <h2>
                                {convertToken(toDisplayData?.paymentToken)}{" "}
                              </h2>
                            </div>
                          </div>
                        </div>

                        <div className={styles.submitBtn}>
                          <button onClick={handleCompleteRent}>
                            {approvalLoading && "Requesting Approval"}{" "}
                            {!approvalLoading &&
                              (rentingLoading ? "Processing" : "Complete Rent")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Modal>
                  <Modal
                    footer={null}
                    open={isConverterModalOpen}
                    onCancel={handleConverterModalCancel}
                    className={styles.currencyModalCover}
                  >
                    <div className={styles.closeMenu}>
                      <CloseOutlined
                        className={styles.closeIcon}
                        onClick={handleConverterModalCancel}
                      />
                    </div>
                    <div className={styles.converterMain}>
                      <h1>
                        Token Converter <SyncOutlined />
                      </h1>
                      <div className={styles.converterMainLower}>
                        <h3>
                          {" "}
                          Your Wallet Balance: {walletBalance.toFixed(
                            4
                          )} ETH{" "}
                        </h3>
                        <div className={styles.converterFormPart}>
                          <input
                            type="text"
                            placeholder="Enter price to convert"
                            onChange={(e) => {
                              convertedPrice(e.target.value);
                            }}
                          />
                          <div className={styles.toggleToken}>
                            <small>Select preferred token</small>
                            <Select
                              size={size}
                              defaultValue={"WETH"}
                              onChange={handleExchangeTokenChange}
                              style={{
                                width: 200,
                                borderRadius: "5px",
                              }}
                              options={[
                                {
                                  value: "WETH",
                                  label: (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {" "}
                                      <img
                                        src="/images/ethereum-eth-logo.png"
                                        alt="ethereum"
                                        width={20}
                                      />{" "}
                                      <span style={{ marginLeft: ".5rem" }}>
                                        {" "}
                                        WETH{" "}
                                      </span>{" "}
                                    </div>
                                  ),
                                },
                                // {
                                //   value: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
                                //   label: (
                                //     <div>
                                //       {" "}
                                //       <img
                                //         src="/images/usd-coin-usdc-logo.png"
                                //         alt="ethereum"
                                //         width={20}
                                //       />{" "}
                                //       <span style={{ marginLeft: ".5rem" }}> USDC </span>{" "}
                                //     </div>
                                //   ),
                                // },
                              ]}
                            />
                            <button onClick={handleConvertToToken}>
                              {conversionLoading
                                ? "Converting . . ."
                                : "Convert"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <button disabled={!valueForExhange} > swap token </button> */}
                  </Modal>
                </>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* } */}
    </div>
  );
};

export default CollectionItemsComp;
