import React, { useState } from "react";
import LendNfts from "../LendNfts/LendNfts";
import WalletNfts from "../WalletNftsComp/walletNfts";
import axios from "axios";
import { Contract } from 'ethers'
import Web3 from 'web3'
import {  moralisApiKey  } from "../../creds"
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
  DEPLOYMENT_SYLVESTER_ETHEREUM_MAINNET_V0
} from "@renft/sdk";
import styles from "./portfoliocomp.module.scss";
import { message } from "antd";
import RentNfts from "../RentNfts/RentNfts";

const PortfolioComp = ({
  walletConnectStatus,
  ownedNfts,
  loadingWallet,
  lendingNfts,
  loadingLendNfts,
  setLendingNfts,
  getNewListFunc,
  rentingNfts,
  getNewListRentFunc,
  loadingRentNfts,
  verifiedCollections,
  userAvatar,
  avatarLoading,
  getWalletNfts,
  reloadUserAvatar
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


  const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546' )


  const { address, connector, isConnected } = useAccount();

  const { data: signer } = useSigner();

  const { chain: mainChain, chains } = useNetwork();

  // const collateralFreeContract = new Sylvester(signer);



  const collateralFreeContract =  getRenftContract({
    deployment: DEPLOYMENT_SYLVESTER_ETHEREUM_MAINNET_V0,
    signer,
  });


  const hadaroGoerliTestContract = new Contract(HADARO_GOERLI_ADDRESS, HADARO_GOERLI_ABI, signer);

  // console.log('sax: ',lendingNfts)
  // console.log('saxon: ',rentingNfts)

  const decodeTxnData = (dataSource, topicsObj) => {

  const { topic1, topic2, topic3 } = topicsObj

  const res =   web3.eth.abi.decodeLog([      {
      indexed: false,
      internalType: 'bool',
      name: 'is721',
      type: 'bool',
    },
    {
      indexed: true,
      internalType: 'address',
      name: 'lenderAddress',
      type: 'address',
    },
    {
      indexed: true,
      internalType: 'address',
      name: 'nftAddress',
      type: 'address',
    },
    {
      indexed: true,
      internalType: 'uint256',
      name: 'tokenID',
      type: 'uint256',
    },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'lendingID',
      type: 'uint256',
    },
    {
      indexed: false,
      internalType: 'uint8',
      name: 'maxRentDuration',
      type: 'uint8',
    },
    {
      indexed: false,
      internalType: 'bytes4',
      name: 'dailyRentPrice',
      type: 'bytes4',
    },
    {
      indexed: false,
      internalType: 'uint16',
      name: 'lendAmount',
      type: 'uint16',
    },
    {
      indexed: false,
      internalType: 'enum IResolver.PaymentToken',
      name: 'paymentToken',
      type: 'uint8',
    }],
dataSource,
  [topic1, topic2, topic3]);

    return res.lendingID
  }


  const nftImageAggregating = (image) => {
    let imageToDisplay;
    if (image.includes(".")) {
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

  // const sortCorsImage = (img) => {
  //   const corsImageModified = new Image();
  //   corsImageModified.crossOrigin = "Anonymous";
  //   corsImageModified.src = img + "?not-from-cache-please";
  //   return corsImageModified.src;
  // };

  // console.log(sortCorsImage(userAvatar[0]?.walletAvatar))

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
              reloadUserAvatar()
            }
          });
      } else {
        message.error("unsupported image type!");
      }
    }
  };

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

  const handlePatch = async(iden, type, status) => {
    try {
      const allNfts = await axios.post(`/api/updateNftTxnType`, { iden, type });

      // console.log('nfts patch result: ', allNfts.data)

      const statusChange = await axios.post(`/api/updateNftStatus`, {
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

      const mainLog = transactionLogs.data?.logs[0]

      const dataToDecode = mainLog?.data

      const topicsObj = {
        topic1: mainLog?.topic1,
        topic2: mainLog?.topic2,
        topic3: mainLog?.topic3
      }



      const result = decodeTxnData(dataToDecode, topicsObj)

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
      console.error(e)
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

  const getColandUpdateItemCount = async(collectionAddr) => {
    // const collectionAddr = "0x999e88075692bCeE3dBC07e7E64cD32f39A1D3ab"
    const getCollection = await axios.post(`/api/fetchItemCollection`, {
      collectionAddr,
    });

    const filterDrafts = getCollection.data.filter((item) => 
    item.collectionAddress.toLowerCase() === collectionAddr.toLowerCase() &&
     !item._id?.includes("drafts"))
    // console.log('results: ', getCollection.data)
    // console.log('results: ', filterDrafts)

    const itemId = filterDrafts[0]?._id

    const itemCount = filterDrafts[0]?.itemCount
    // console.log('results: ', itemCount)

    let finalValue

    if(itemCount === null) {
      finalValue = 0
    } else {
      finalValue = Number(itemCount)
    }

   const valueToSend = String(finalValue - 1)
    // console.log('final: ', valueToSend)

    if (valueToSend === "-1") {
      const count = "0"

      const patchItem  = await axios.post(`/api/updateCollectionItemCount`, {
        itemId,
        count
      });
          // console.log('res0: ', patchItem.data) 
    } else {
      const count = valueToSend
      const patchItem  = await axios.post(`/api/updateCollectionItemCount`, {
        itemId,
        count
      });
  
      // console.log('res1: ', patchItem.data)
    }
  }


  const prepareStopLend = async (position) => {
    try {
      setLoadingLendRemove(true);
      const objToLook = lendingNfts[position];
      // console.log('prep up', objToLook)

      const tokenAddr = objToLook?.nftAddress;
      const tokenID = objToLook?.tokenID;
      const nftStandard = objToLook?.nftStandard;
      const nftAddress = objToLook?.nftAddress;
      const iden = objToLook?._id;
      const transactionHash = objToLook?.transactionHash

      // console.log('hash', transactionHash)

      const lendingID = await getLendingIdForNft(transactionHash, "goerli");

      // console.log("id", lendingID);

  //     const lendingID = res.lendings[0].id;

      if (mainChain?.name !== "Goerli") {
        message.error("Please Connect to the Goerli Network to proceed", [3]);
        setLoadingLendRemove(false);
      } else {
        const txn = await hadaroGoerliTestContract.stopLend(
          [nftStandard],
          [nftAddress],
          [tokenID],
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
            iden,
            "previousListed for lending",
            "non-available"
          );
          await getColandUpdateItemCount(nftAddress)
          await handleRemoveElement(position);
          message.success("successfully stopped lend of NFT!");
          await getNewListFunc();
          await getWalletNfts()
        }
      }
      setLoadingLendRemove(false);
    } catch (e) {
      setLoadingLendRemove(false);
      // console.error(e);
      if (e.message[0] === "u" && e.message[1] === "s") {
        message.error("user rejected transaction");
      } else if (e.message[0] === "F") {
        message.error("something went wrong");
      }
    }
  };

  // console.log('owned', ownedNfts)



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
          {userAvatar?.length > 0  && (
            <div className={styles.changeAvatar}> 
            <label htmlFor="imagefile">
              <p>Change avatar
              </p>
              </label>
              <input
                  id="imagefile"
                  type="file"
                  onChange={(e) => {
                    setAvatarFile(e.target.files[0]);
                    uploadImage(e);
                  }}
                />
            </div>)}
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
                              nftname={el.metadataName}
                              nftImage={nftImageAggregating(el.metadataImage)}
                              setLendItem={prepareStopLend}
                              position={index}
                              loadingLend={loadingLendRemove}
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
                              nftname={el.metadataName}
                              nftImage={nftImageAggregating(el.metadataImage)}
                              nftStatus={el.status}
                              position={index}
                              loadingRent={loadingRentRemove}
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
                          //          <>
                          //          <div className={styles.nftCardCover}>
                          //          <div key={index} className={styles.nftCard}>
                          //      <div className={styles.imageCover}>
                          //      <img
                          //      onError={(e) =>
                          //        e.target.src = "/images/no-image-placeholder.png"
                          //      }
                          //      src={  el.metadata === null ? "/images/no-image-placeholder.png" :  el.image ? el.image : el.image === null ? "/images/no-image-placeholder.png" : ""} />
                          //      </div>
                          //      <div className={styles.downPart}>
                          //        <span> {convertMetadata(index)} </span>
                          //        <span>
                          //          {el.name} xx
                          //        </span>
                          //        <span>
                          //        {console.log(el.image)}
                          //        </span>
                          //      </div>
                          //  </div>
                          //  </div>
                          //  </>
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
          {/* <button onClick={decodeTxnData}>get and add to item count</button> */}
        </div>
      </div>
    </div>
  );
};

export default PortfolioComp;
