import React, { useState } from "react";
import { Modal, message, Select } from "antd";
import axios from "axios";
import {
  useAccount,
  useSigner,
  useSignMessage,
  useProvider,
  useConnect,
  erc721ABI,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { Contract, utils } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import {
  Sylvester,
  NFTStandard,
  packPrice,
  SYLVESTER_ADDRESS,
  getRenftContract,
  DEPLOYMENT_SYLVESTER_ETHEREUM_MAINNET_V0,
} from "@renft/sdk";
import Web3 from "web3";
import { HADARO_GOERLI_ADDRESS, HADARO_GOERLI_ABI, erc1155Abi } from "../../constants/abis";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { SylvieABI } from "../../utils/abis";
import styles from "./lendoutro.module.scss";

const LendOutroModal = ({
  outroOpen,
  cancleOutro,
  cancelLendModal,
  finalLendObject,
  removeLent,
  currentLendIndex,
  setLoadingTxn,
  loadingTxn,
  showLendModal,
  setApprovalLoad
}) => {
  const parseStandards = (value) => {
    if (value === "ERC721") {
      return 0;
    }
    if (value === "ERC1155") {
      return 1;
    }
  };

  // console.log('xoxo', finalLendObject)

  const { data: signer } = useSigner();

  const { address } = useAccount();

  const { chain: mainChain, chains } = useNetwork();

  const { data, error, isLoading, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      processLend();
    },
  });

  // const collateralFreeContract = new Sylvester(signer);

  const hadaroGoerliTestContract = new Contract(
    HADARO_GOERLI_ADDRESS,
    HADARO_GOERLI_ABI,
    signer
  );

  const web3 = new Web3(
    Web3.givenProvider || "ws://some.local-or-remote.node:8546"
  );

  // const collateralFreeContract =  getRenftContract({
  //   deployment: DEPLOYMENT_SYLVESTER_ETHEREUM_MAINNET_V0,
  //   signer,
  // });

  // const provider = new JsonRpcProvider('https://mainnet.infura.io/v3/6fe73d73563b4e56aef1516412dfe130');
  // const privKey = '6d62eb36590393197c6bc45f7471fbc7f66ae9363f33c1c03144957df95a75d4';
  // let wallet = new Wallet(privKey);
  // wallet = wallet.connect(provider);

  const unfakeTxn = () =>
    setTimeout(() => {
      setLoadingTxn(false);
      cancelLendModal();
      removeLent(currentLendIndex);
    }, 5000);

  const provider = useProvider();

  const nftAddress = finalLendObject.nftAddress;
  const tokenID = finalLendObject.tokenID;
  const lendAmount = finalLendObject.amount;
  const dailyRentPrice = packPrice(finalLendObject.dailyRentPrice);
  const maxRentDuration = finalLendObject.maxRentDuration;
  const paymentToken = finalLendObject.paymentToken;
  const nftStandard = parseStandards(finalLendObject.nftStandard);
  const chain = finalLendObject.chain;
  const collectionName = finalLendObject.collectionName;
  const collectionSymbol = finalLendObject.collectionSymbol;
  const metadataImage = finalLendObject.nftImage;
  const metadataDesc = finalLendObject.nftDesc;
  const metadataName = finalLendObject.nftName;

  const finlObject = {
    nftAddress,
    tokenID,
    lendAmount,
    dailyRentPrice,
    maxRentDuration,
    paymentToken,
    nftStandard,
    chain,
  };

  // console.log('hjkol', finlObject);

  // console.log('parsed price', dailyRentPrice)

  // const ERC721Contract = useContract({
  //   addressOrName: nftAddress,
  //   contractInterface: erc721ABI,
  //   signerOrProvider: provider,
  // });

  async function requestE1155Approval() {
    setApprovalLoad(true);
    try {
  // Get signer's address
  const address = await signer.getAddress();

  // Initialize a contract instance for the NFT contract
  const ERC1155Contract = new Contract(nftAddress, erc1155Abi, signer);

  // Make sure user is owner of the NFT in question

  // console.log('token id', tokenID)
  const tokenOwner = await ERC1155Contract.balanceOf(address, tokenID);
  const convHex = web3.utils
  .toBN(tokenOwner._hex)
  .toString();
  // console.log('token owner: ', convHex)
  // console.log('address: ', address)
  if (convHex === 0 ) {
    setApprovalLoad(false);
    throw new Error(`You do not own this NFT`); 
  }

  // // getApproved(uint256 tokenId)
  // // approve(address to, uint256 tokenId)
  // Check if user already gave approval to the marketplace
  const isApproved = await ERC1155Contract.isApprovedForAll(address, HADARO_GOERLI_ADDRESS);
  // console.log('approve: ', isApproved)
  // If not approved
  if (!isApproved) {
    // console.log("Requesting approval over NFTs...");

    // Send approval transaction to NFT contract
const approvalTxn = await ERC1155Contract.setApprovalForAll(HADARO_GOERLI_ADDRESS, true)
      const receipt = await approvalTxn.wait();

      // console.log('approval', receipt)


      if (receipt.blockNumber !== null && receipt.confirmations > 0) {
        // const transferToken =  await ERC1155Contract.safeTransferFrom(address, HADARO_GOERLI_ADDRESS, tokenID, lendAmount, "0x00")
        // const receipt = await transferToken.wait();
        //  console.log('approval2i', receipt)
        //  if (receipt.blockNumber !== null && receipt.confirmations > 0) { 
          setApprovalLoad(false);
          return "operation success"
      }
  } else {
    // console.log("viva")
    setApprovalLoad(false);
    return "operation success"
    // const transferToken =  await ERC1155Contract.safeTransferFrom(address, HADARO_GOERLI_ADDRESS, tokenID, lendAmount, "0x00")
    // const receipt = await transferToken.wait();
    //  console.log('approval2j', receipt)
    //  if (receipt.blockNumber !== null && receipt.confirmations > 0) { 
      // setApprovalLoad(false);
      // setAlreadyApprovedToken(true)
    //  }
    // setAlreadyApprovedToken(true)
  } 
    // setApprovalLoad(false);
    } catch (e) {
      // console.warn(e)
      if (e.code === "ACTION_REJECTED") {
        message.error("user denied transaction")
        setApprovalLoad(false)
        return "operation failed"
        //  setAlreadyApprovedToken(false)
      } else {
        message.error("something went wrong...")
        setApprovalLoad(false)
        return "operation failed"
        // setAlreadyApprovedToken(false)
      }
    }
   
  
  }
  async function requestE721Approval() {
    setApprovalLoad(true);
    try {
  // Get signer's address
  const address = await signer.getAddress();

  // Initialize a contract instance for the NFT contract
  const ERC721Contract = new Contract(nftAddress, erc721ABI, signer);

  // Make sure user is owner of the NFT in question

  // console.log('token id', tokenID)
  const tokenOwner = await ERC721Contract.ownerOf(tokenID);
  // console.log('token owner: ', tokenOwner)
  // console.log('address: ', address)
  if (tokenOwner.toLowerCase() !== address.toLowerCase()) {
    setApprovalLoad(false);
    throw new Error(`You do not own this NFT`); 
  }

  // getApproved(uint256 tokenId)
  // approve(address to, uint256 tokenId)
  // Check if user already gave approval to the marketplace
  const isApproved = await ERC721Contract.getApproved(Number(tokenID));
  // console.log('approve: ', isApproved)
  // If not approved
  if (isApproved.toLowerCase() !== HADARO_GOERLI_ADDRESS.toLowerCase()) {
    // console.log("Requesting approval over NFTs...");

    // Send approval transaction to NFT contract
    const approvalTxn = await ERC721Contract.approve(
      HADARO_GOERLI_ADDRESS,
      Number(tokenID)
    );
      const receipt = await approvalTxn.wait();

      // console.log('approval', receipt)


      if (receipt.blockNumber !== null && receipt.confirmations > 0) {
        setApprovalLoad(false);
        return "operation success"
        // setLoadingTxn(true)
        // setAlreadyApprovedToken(true)
      }
  } else {
    setApprovalLoad(false);
    return "operation success"
    // setLoadingTxn(true)
    // setAlreadyApprovedToken(true)
  } 
    // setApprovalLoad(false);
    } catch (e) {
      // console.warn(e)
      // console.warn(e.code)
      if (e.code === "ACTION_REJECTED") {
        message.error("user denied transaction")
        setApprovalLoad(false)
        return "operation failed"
        // setAlreadyApprovedToken(false)
        // setLoadingTxn(false)
      } else {
        message.error("something went wrong...")
        setApprovalLoad(false)
        return "operation failed"
        // setLoadingTxn(false)
        // setAlreadyApprovedToken(false)
      }
    }
   
  
  }

  const createId = (value) => {
    const result = value
      .replace(/([^\w ]|_)/g, "")
      .split(" ")
      .join("-")
      .toLowerCase();
    return result;
  };

  const sylvesterLend = async (transactionType, chain, status) => {
    try {
      const txn = await hadaroGoerliTestContract.lend(
        [nftStandard],
        [nftAddress],
        [tokenID],
        [lendAmount],
        [maxRentDuration],
        [dailyRentPrice],
        [paymentToken],
        [false]
      );
  
      const receipt = await txn.wait();
  
      //  console.log(receipt);
  
  
      if (receipt.blockNumber !== null && receipt.confirmations > 0) {
        const document = {
          // for live
          // _type: "nftData",
          // for test
          _type: "testNftData",
          nftAddress,
          tokenID,
          chain,
          lenderAddress: address,
          price: dailyRentPrice,
          paymentToken: String(paymentToken),
          maxDuration: maxRentDuration,
          transactionType,
          status,
          metadataName,
          metadataDesc,
          metadataImage,
          nftCollectionName: collectionName,
          nftStandard: String(nftStandard),
          lendTransactionHash: receipt.transactionHash,
        };
  
        const resty = await axios.post(`/api/postNftData`, document);
  
        //  console.log('docusave', resty.data)
        // const nftAddres = "0x999e88075692bCeE3dBC07e7E64cD32f39A1D3ab"
        // const collectionAddr = "0x999e88075692bCeE3dBC07e7E64cD32f39A1D3ab"
        const collectionAddr = nftAddress;
        // const collectionAddr = nftAddres
        const getCollection = await axios.get(`/api/fetchItemCollection`, {
          collectionAddr,
        });
  
        // console.log('original col: ', getCollection.data)
  
        const filterDrafts = getCollection.data.filter(
          (item) => !item._id?.includes("drafts")
        );
        // console.log('filter col: ', filterDrafts)
  
        const itemId = filterDrafts[0]?._id;
  
        const itemCount = filterDrafts[0]?.itemCount;
        // console.log('item count: ', itemCount)
  
        let finalValue;
  
        if (itemCount === null) {
          finalValue = 0;
        } else {
          finalValue = Number(itemCount);
        }
  
        const valueToSend = String(finalValue + 1);
        // console.log('final: ', valueToSend)
  
        const count = valueToSend;
  
        await axios.post(`/api/updateCollectionItemCount`, {
          itemId,
          count,
        });
  
        setLoadingTxn(false);
  
        cancelLendModal();
  
        message.success("Lending successful!");
  
        removeLent(currentLendIndex);
        // console.log('res: ', patchItem.data)
      }
  
    } catch (e) {
      // console.info(e)
      if (e.code === "ACTION_REJECTED") {
        message.error("user denied transaction")
        setLoadingTxn(false)
      } else {
        message.error("something went wrong")
      }
    }

    // const collection = {
    //   _type: "collectionsData",
    //   _id: createId(collectionName),
    //   collectionName: collectionName,
    //   collectionSymbol: collectionSymbol,
    //   chain,
    //   collectionAddress: nftAddress,
    // };

    // console.log(response.data);

    //   if(response.data.msg === 'success') {

    //     const res = await axios.post(`/api/postCollectionsData`, collection);
    //     console.log('for collectionCreation', res.data);

    //     if(res.data.msg === 'success') {
    //        console.log('collection created successfully')
    //   }

    //   if(res.data.response.body.error.items[0].error.description === `Document by ID "${createId(collectionName)}" already exists`){
    //     console.log('collection successful')
    //   }
    //  }
  };

  const processLend = async () => {
    try {
      // const nftAddress = finalLendObject.nftAddress;
      // const tokenID = finalLendObject.tokenID;
      // const lendAmount = finalLendObject.amount;
      // const dailyRentPrice = packPrice(finalLendObject.dailyRentPrice);
      // const maxRentDuration = finalLendObject.maxRentDuration;
      // const paymentToken = finalLendObject.paymentToken;
      // const nftStandard = parseStandards(finalLendObject.nftStandard);

      const transactionType = "lending";

      const status = "available";

      const finalObject = {
        nftAddress,
        tokenID,
        lendAmount,
        dailyRentPrice,
        maxRentDuration,
        paymentToken,
        nftStandard,
        chain,
      };

      // console.log(finalObject);

      // message.success(`lending successful!`, [5])
      // console.log(finalLendObject)
      cancleOutro();

      showLendModal();

      setLoadingTxn(true);

      // write?.();

      // console.log(data?.hash);
      if (nftStandard === 0) {
        const stat =  await requestE721Approval();
        // console.log('stats1', stat)
        if (stat === "operation success") {
         // if (alreadyApprovedToken) {
           await sylvesterLend(transactionType, chain, status);
   
        }
         }
   
         if (nftStandard === 1) {
           // console.log("xyz")
        const stat =  await requestE1155Approval()
        // console.log('stats2', stat)
        if (stat === "operation success") {
           await sylvesterLend(transactionType, chain, status);
        }
       
         }
      // unfakeTxn()

    } catch (e) {
      // console.warn(e)
      setApprovalLoad(false)
      // if (e.message[0] === "u") {
      //   message.error(e.message.slice(0, 25), [3]);
      // } else if (e === "You do not own this NFT") {
      //   message.error("already lent");
      // } else if (
      //   e.error?.message === "execution reverted: Hadaro::rent price is zero"
      // ) {
      //   message.error("daily rental price entered too low", [3]);
      // } else if (e.message === "supplied price exceeds 9999.9999") {
      //   message.error("daily rent price supplied too high", [3]);
      // } else {
      //   message.error("Something went wrong...", [5]);
      // }
      // // console.warn(e)
      // // console.warn((prepareError || error)?.message);
      // setLoadingTxn(false);
      
    }
  };

  return (
    <Modal
      open={outroOpen}
      footer={null}
      onCancel={cancleOutro}
      className={styles.modalContainer}
    >
      <h3>Are you sure?</h3>
      <div className={styles.modalButtons}>
        <button
          //  disabled={!write || isLoading} onClick={() => write()}
          onClick={() => {
            // const message = JSON.stringify(finlObject)
            //   signMessage({message})
            processLend();
          }}
        >
          Yes
        </button>
        <button onClick={() => cancleOutro()}>No</button>
      </div>
    </Modal>
  );
};

export default LendOutroModal;
