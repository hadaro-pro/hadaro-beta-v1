import React, { useState } from "react";
import { Modal, message, Select } from "antd";
import axios from 'axios';
import {
  useAccount,
  useSigner,
  useSignMessage,
  useProvider,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContract,
  useConnect,
  erc721ABI,
  useNetwork
} from "wagmi";
import { Contract } from 'ethers'
import { JsonRpcProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import {
  Sylvester,
  NFTStandard,
  packPrice,
  SYLVESTER_ADDRESS,
} from "@renft/sdk";
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

  const { address  } = useAccount()

  const { chain: mainChain, chains } = useNetwork()

 

  const collateralFreeContract = new Sylvester(signer);

  

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
  const metadataImage = finalLendObject.nftImage
  const metadataDesc = finalLendObject.nftDesc
  const metadataName = finalLendObject.nftName




  // console.log('parsed price', dailyRentPrice)


  // const ERC721Contract = useContract({
  //   addressOrName: nftAddress,
  //   contractInterface: erc721ABI,
  //   signerOrProvider: provider,
  // });


  async function requestApproval() {
    // Get signer's address
    const address = await signer.getAddress();

    // Initialize a contract instance for the NFT contract
    const ERC721Contract = new Contract(nftAddress, erc721ABI, signer);

    // Make sure user is owner of the NFT in question
    const tokenOwner = await ERC721Contract.ownerOf(tokenID);
    if (tokenOwner.toLowerCase() !== address.toLowerCase()) {
      throw new Error(`You do not own this NFT`);
    }

    // Check if user already gave approval to the marketplace
    const isApproved = await ERC721Contract.isApprovedForAll(
      address,
      SYLVESTER_ADDRESS
    );

    // If not approved
    if (!isApproved) {
      // console.log("Requesting approval over NFTs...");

      // Send approval transaction to NFT contract
      const approvalTxn = await ERC721Contract.setApprovalForAll(
        SYLVESTER_ADDRESS,
        true
      );
      await approvalTxn.wait();
    }
  }

  const createId = (value) => {
    const result = value.replace(/([^\w ]|_)/g, '').split(" ").join("-").toLowerCase()
    return result
  }


  const sylvesterLend = async(transactionType, chain, status) => {
    const txn = await collateralFreeContract.lend(
      [nftStandard],
      [nftAddress],
      [tokenID],
      [lendAmount],
      [maxRentDuration],
      [dailyRentPrice],
      [paymentToken]
    );

   const receipt = await txn.wait()

  //  console.log(receipt);

  const document = {
    _type: "nftData",
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
    nftStandard: String(nftStandard)
  };

  const collection = {
    _type: "collectionsData",
    _id: createId(collectionName),
    collectionName: collectionName,
    collectionSymbol: collectionSymbol,
    chain,
    collectionAddress: nftAddress,
  }; 

  const response = await axios.post(`/api/postNftData`, document);

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
}

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

      const status = "available"

      const finalObject = {
        nftAddress,
        tokenID,
        lendAmount,
        dailyRentPrice,
        maxRentDuration,
        paymentToken,
        nftStandard,
        chain
      };

      // console.log(finalObject);

      // message.success(`lending successful!`, [5])
      // console.log(finalLendObject)
      cancleOutro();

      showLendModal();

      setLoadingTxn(true);

      // write?.();

      // console.log(data?.hash);



      if(nftStandard === 0) {
         await  requestApproval()
         await sylvesterLend(transactionType, chain, status)
      } 

      if(nftStandard === 1) {
       await sylvesterLend(transactionType, chain, status)
      }


       
      // unfakeTxn()

      setLoadingTxn(false);

      cancelLendModal();

      message.success('Lending successful!')

      removeLent(currentLendIndex);
    } catch (e) {
      console.warn(e)
      if (e === 'You do not own this NFT') {
        message.error('already lent')
      }
      // console.warn((prepareError || error)?.message);
      setLoadingTxn(false);
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
        onClick={() => processLend()}
        >Yes</button>
        <button onClick={() => cancleOutro()}>No</button>
      </div>
    </Modal>
  );
};

export default LendOutroModal;
