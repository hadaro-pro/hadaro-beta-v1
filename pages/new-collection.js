import React from 'react'
import Footer from '../components/Footer/footer'
import Navbar from '../components/Navbar/Navbar'
import NewCollectionComp from '../components/NewCollection/NewCollection'

const NewCollection = () => {
  return (
   <div>
    <Navbar/>
    <NewCollectionComp />
    <Footer />
   </div>
  )
}

export default NewCollection