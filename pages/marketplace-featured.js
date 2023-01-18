import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import Navbar from '../components/Navbar/Navbar'
import MarketFeatured from '../components/MarketFeatured/marketFeatured'
import Footer from '../components/Footer/footer'
import { saveCollectionItemDetails } from '../core/actions/collectionActions.js/collectionActions';

const MarketplaceFeatured = () => {

  const [collections, setCollections] = useState(null)
  const [singleCollectionDetails] = useState([])
  const [loading, setLoading] = useState(false)

  console.log('frem', singleCollectionDetails)

  const dispatch = useDispatch()



  // const sharpSTuff = async() => {
  //   try {
  //     const res = await axios.post(`/api/postCollectionsData`);
  //     console.log('for collectionDelete', res.data);
  //   } catch(e) {
  //     console.warn(e)
  //   }
  // }

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


  const getAllCollections = async() => {
    let mainArrItems = []
 
    try {

    
  setLoading(true)

   const getCollections = await axios.get(`/api/fetchCollectionData`);

   const { data } = getCollections

  //  console.log(data.length) 

   setCollections(data)

 
   data?.forEach(async(el) => {
    // console.log('el: ',el.collectionAddress)
    const contractAddr = el?.collectionAddress
         const getFirstNft = await axios.post(`/api/fetchSingleNft`, {contractAddr})
   
      console.log('nftdets', getFirstNft?.data)
   
      const nftImage = await extractMetaData(getFirstNft?.data)

      // console.log('nftimageMeta: ', nftImage?.data?.metadata?.image)

      console.log('xr', nftImage)

      let image = nftImage?.data?.metadata?.image

      console.log('xr', image)
 

      let metaImg = ''

      if(image.includes(".")) {
        metaImg = image
      } else {
        metaImg =  "https://ipfs.moralis.io:2053/ipfs/" + image;
      }


      if(image.includes("https://") || image.includes("data:image/")) {
        metaImg = image;
      } else {
        let splicer =  image.slice(7)
        metaImg =  "https://gateway.ipfscdn.io/ipfs/" + splicer;
       
      }
      
      console.log('metaIbh: ', metaImg)

      // singleCollectionDetails.push({parsedImage: metaImg})
      mainArrItems.push({metaImg})
   } )



   console.log('gerty', mainArrItems)


  //  for (let index = 0; index < data.length; index++) {
  //     const contractAddr = data[index].collectionAddress

  //     // console.log('contrAse: ', contractAddr)

  //     const getFirstNft = await axios.get(`/api/fetchSingleNft`, contractAddr)
   
  //     console.log('nftdets', getFirstNft)
 
  //     // singleCollectionDetails?.push(getFirstNft)
  //  }
 

  //  console.log(collections)

  dispatch(saveCollectionItemDetails(mainArrItems))




  //  console.log('lengthi', singleCollectionDetails)
  setLoading(false)
    } catch(e) {
     console.error(e)
    }
 }
  
  useEffect(() => {
    getAllCollections()
  }, [])

  return (
    <div>
      <Navbar />
      <MarketFeatured storeCollections={collections} imagesArray={singleCollectionDetails} loadingCollections={loading} />
      {/* <button onClick={sharpSTuff}>
        delete
      </button> */}
      <Footer />
    </div>
  )
}

export default MarketplaceFeatured