import React, { useEffect, useState } from 'react'
import axios from "axios";
import Footer from '../components/Footer/footer'
import LendPortfolioComp from '../components/LendPortfolioComp/lendPortfolioComp'
import Navbar from '../components/Navbar/Navbar'
import PortfolioComp from '../components/PortfolioComp/portfolioComp'

const LendPortfolio = () => {

  const [verifiedCollectionsArray, setVerifiedCollectionsArray] = useState([])


  // console.log('bracka', verifiedCollectionsArray)

   const getAllCollections = async() => {
    let mainArrItems = []
 
    try {

  

   const getCollections = await axios.get(`/api/fetchCollectionData`);

 
  //  console.log('xacv', getCollections.data)


   getCollections?.data.forEach((item) => {
    mainArrItems.push(item.collectionAddress.toLowerCase())
   })


   setVerifiedCollectionsArray(mainArrItems)

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
      <LendPortfolioComp verifiedCollections={verifiedCollectionsArray} />
      <Footer />
    </div>
  )
}

export default LendPortfolio