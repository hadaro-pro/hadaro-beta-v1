import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import CollectionItemsComp from '../../components/CollectionItemsComp/collectionItemsComp'
import Footer from '../../components/Footer/footer'
import Navbar from '../../components/Navbar/Navbar'


const CollectionItems = () => {


  const [finalCollectionItems, setFinalCollectionItems] = useState(null)

  const [loading, setLoading] = useState(false)

  const [sealFooter, setSealFooter] = useState(false)


  const collectionDetails = useSelector((state) => state.collectionDetails)


  const { collectionInfo } = collectionDetails


  const { colAddress } = collectionInfo

  // console.log('addr: ', colAddress)


  const extractMetaData = async(nftObj) => {
    const {nftAddress, tokenID , chain} = nftObj

    const metaData = await axios.get(`/api/fetchSingleNftMeta`, {
      params: {
      tokenAddr: nftAddress, 
      tokenID: tokenID,
       chain: chain,
      }
    })

    return metaData
}

  const fetchCollectionNfts = async() => {
    try {
      setLoading(true)
      const contractAddr = colAddress.toLowerCase()

      // console.log('contadrt: ', contractAddr)
      const response = await axios.post(`/api/fetchMainNftsInCollection`, {contractAddr})

  
      // const filterByContractAddr = response.data?.filter((item) => item.nftAddress.toLowerCase() === contractAddr.toLowerCase())


         const filterByActivity = response.data?.filter((item) => item.transactionType !== "previousListed for lending" )

      // previousListed for lending
      // console.log('filtration', filterByContractAddr)

      //   console.log('resti: ', response.data)

       setFinalCollectionItems(filterByActivity)

      setLoading(false)
    } catch(err) {
      console.error(err)
    }
  }


  useEffect(() => {
    fetchCollectionNfts()
  }, [])



  return (
    <div>
      <Navbar/>
     <CollectionItemsComp  openFooter={setSealFooter}  loadingItems={loading}  itemsToDisplay={finalCollectionItems} />
   <Footer/>
    </div>
  )
}

export default CollectionItems