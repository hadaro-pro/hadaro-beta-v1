import React, {useState} from 'react'
import LendNfts from '../LendNfts/LendNfts'
import WalletNfts from '../WalletNftsComp/walletNfts'
import axios from 'axios'
import { createClient } from 'urql'
import { SYLVESTER_SUBGRAPH_URL } from '../../creds'
import { useAccount, useConnect, useSigner, useProvider, erc721ABI, useNetwork } from "wagmi";
import { Sylvester, PaymentToken, NFTStandard, packPrice, unpackPrice } from '@renft/sdk'
import styles from './portfoliocomp.module.scss'
import { message } from 'antd'
import RentNfts from '../RentNfts/RentNfts'

const PortfolioComp = ({ walletConnectStatus, ownedNfts, loadingWallet, lendingNfts, loadingLendNfts, setLendingNfts, getNewListFunc, rentingNfts, getNewListRentFunc, loadingRentNfts}) => {

  const [openLend, setOpenLend] = useState(false)
  const [openRent, setOpenRent] = useState(false)
  const [openWallet, setOpenWallet] = useState(false)
  const [loadingLendRemove, setLoadingLendRemove] = useState(false)
  const [loadingRentRemove, setLoadingRentRemove] = useState(false) 

  const { address, connector, isConnected } = useAccount();

  const { data: signer } = useSigner();

  const { chain: mainChain, chains } = useNetwork()


  const collateralFreeContract = new Sylvester(signer);


  // console.log('sax: ',lendingNfts)
  // console.log('saxon: ',rentingNfts)  


  const nftImageAggregating = (image) => {

    let imageToDisplay
  if (image.includes(".")) {
    imageToDisplay = image;
  } 
  else {
   imageToDisplay = "https://ipfs.moralis.io:2053/ipfs/" + meta.image;
  }

 if(image?.includes("https://") || image?.includes("data:image/")) {
    imageToDisplay = image;
  } else {
    let splicer =  image?.slice(7)
    imageToDisplay =  "https://gateway.ipfscdn.io/ipfs/" + splicer;
   
  }

  return imageToDisplay  
};


  const handleRemoveElement = (position) => {
    // window.alert(position)
    // console.log(lendingNfts)
      return lendingNfts.splice(position, 1)
      // setLendingNfts(newArr)
  }

  const convertMetadata = (index) => {
    let meta = JSON.parse(ownedNfts[index]?.metadata)
    return meta?.name
  }


  const handlePatch = async(iden, type, status) => {
    try {
           const allNfts = await axios.put(`/api/updateNftData`, {iden, type})

      console.log('nfts patch result: ', allNfts.data)

      const statusChange = await axios.put(`/api/updateNftStatus`, {identity, status})

      console.log('nfts patch result: ', allNfts.data)

    } catch (err) {
      console.error(err)
    }
  }


  const getLendingIdForNft = async (tokenAddr, tokenID) => {

    

    try {
      const queryNft = `
      query LendingsQuery {
          lendings (where: {nftAddress: "${tokenAddr}", tokenID: "${tokenID}"}) {
            id
            tokenID
          }
        }`;

      const urqlClient = createClient({
        url: SYLVESTER_SUBGRAPH_URL
      })
        
    const response = await urqlClient.query(queryNft).toPromise()

    const result = response.data

    // console.log(result)

    return result



     
    } catch(e) {
      // console.log(e)
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


  const prepareStopLend = async(position) => {
    try {
      setLoadingLendRemove(true)
    const objToLook = lendingNfts[position]
    // console.log('prep up', objToLook)

    const tokenAddr = objToLook?.nftAddress
    const tokenID = objToLook?.tokenID
    const nftStandard = objToLook?.nftStandard
    const nftAddress = objToLook?.nftAddress
    const iden = objToLook?._id

    const res = await getLendingIdForNft(tokenAddr, tokenID)

    console.log('id', res.lendings[0].id)

    const lendingID = res.lendings[0].id

      if (mainChain?.name !== "Ethereum") {
        message.error("Please Connect to the Ethereum Network to proceed", [3]);
        setLoadingLendRemove(false)
      } else {
           const txn = await collateralFreeContract.stopLending(
        [nftStandard],
        [nftAddress],
        [tokenID],
        [lendingID],
      );

      const receipt = await txn.wait()

      if(receipt) {
        message.success('successfully stopped lend of NFT!')
        handleRemoveElement(position)
        await handlePatch(iden, "previousListed for lending", "non-available")
        getNewListFunc()
      }
      }
      setLoadingLendRemove(false)
         handleRemoveElement(position)
          await handlePatch(iden, "previousListed for lending", "non-available")
         getNewListFunc()
       
    } catch (error) {
      setLoadingLendRemove(false)
      console.error(error)
    }
    
    



  }


  // console.log('owned', ownedNfts)


  return (
    <div className={styles.mainContainer}>
      <div className={styles.caption} >
        <h1>PORTFOLIO</h1>
      </div>

      <div className={styles.mainComp} >
        <div  className={styles.mainCompInner} >
          <div className={styles.imgPart}>
            <img  src="/images/port-img.png"  alt='img'  />
          </div>
          <div className={styles.lowerPart}>
          <div  className={styles.menuItem }>
            <div className={styles.menuItemTop}>
          <img className={styles.menuItemImage}  src={`${openLend ? '/images/minus.png' : '/images/cross.png' }`} alt=""  onClick={() => { setOpenLend((prev) => !prev) }} />
          <p className={styles.menuItemText}>Lending</p>
          </div>
          <div  className={openLend ? styles.dropdownmenu : styles.dropdownmenuinactive}>
            <div  className={styles.subdropmenu}>
            { walletConnectStatus ? loadingLendNfts ? (<div> <small>Loading...</small> </div>) : lendingNfts?.length ==  0 ?  <small>No Lending NFTs at the moment</small>:<div className={styles.mainCover}>
          {  lendingNfts?.map((el, index) => 
           
           ( 
            <div key={index}>
         <LendNfts nftname={el.metadataName}  nftImage={nftImageAggregating(el.metadataImage)} setLendItem={prepareStopLend} position={index} loadingLend={loadingLendRemove} />
            </div>
     )
   
   )}
          </div>
          // (ownedNfts?.map((item, index) => {
          // <h1 key={index}>{item.token_address}</h1>})) 
          : <small>Connect your wallet to view</small>}
            {/* { walletConnectStatus ?   <small>This shows the NFTS that are being lent</small>   : <small>Connect your wallet to view</small>}   */}
            </div>
          </div>
          </div>

          <div  className={styles.menuItem }>
            <div className={styles.menuItemTop}>
          <img className={styles.menuItemImage}  src={`${openRent ? '/images/minus.png' : '/images/cross.png' }`}  alt=""  onClick={() => { setOpenRent((prev) => !prev) }} />
          <p className={styles.menuItemText}>Renting</p>
          </div>
          <div  className={openRent ? styles.dropdownmenu : styles.dropdownmenuinactive}>
            <div  className={styles.subdropmenu}>
            { walletConnectStatus ? loadingRentNfts ? (<div> <small>Loading...</small> </div>) : rentingNfts?.length ==  0 ?  <small>No Renting NFTs at the moment</small>:<div className={styles.mainCover}>
          {  rentingNfts?.map((el, index) => 
           
           ( 
            <div key={index}>
         <RentNfts nftname={el.metadataName}  nftImage={nftImageAggregating(el.metadataImage)}  nftStatus={el.status}  position={index} loadingRent={loadingRentRemove} />
            </div>
     )
   
   )}
          </div>
          // (ownedNfts?.map((item, index) => {
          // <h1 key={index}>{item.token_address}</h1>})) 
          : <small>Connect your wallet to view</small>}
            {/* { walletConnectStatus ?   <small>This shows the NFTS that are being rented</small>  : <small>Connect your wallet to view</small>} */}
           
            </div>
          </div>
          </div>

          <div  className={styles.menuItem }>
            <div className={styles.menuItemTop}>
          <img className={styles.menuItemImage}  src={`${openWallet ? '/images/minus.png' : '/images/cross.png' }`}  alt=""  onClick={() => { setOpenWallet((prev) => !prev) }} />
          <p className={styles.menuItemText}>My Wallet</p>
          </div>
          <div  className={openWallet ? styles.dropdownmenu : styles.dropdownmenuinactive}>
            <div  className={styles.subdropmenu}>
              {/* {loadingWallet ? (<div> <p>Loading...</p> </div>) : " " } */}
          { walletConnectStatus ? loadingWallet ? (<div> <small>Loading...</small> </div>) : ownedNfts?.length < 0 ?  <small>No NFTs in wallet</small>:<div className={styles.mainCover}>
          {  ownedNfts?.map((el, index) => 
           
           ( 
            <div key={index}>
            <WalletNfts collectionName={el.name} nftname={convertMetadata(index)}  nftImg={el.image} metadata={el.metadata} />
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
     )
   
   )}
          </div>
          // (ownedNfts?.map((item, index) => {
          // <h1 key={index}>{item.token_address}</h1>})) 
          : <small>Connect your wallet to view</small>}
            </div>
          </div>
          </div>
         
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioComp