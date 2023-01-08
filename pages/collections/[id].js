import React from 'react'
import CollectionItemsComp from '../../components/CollectionItemsComp/collectionItemsComp'
import Footer from '../../components/Footer/footer'
import Navbar from '../../components/Navbar/Navbar'


const CollectionItems = () => {
  return (
    <div>
      <Navbar/>
     <CollectionItemsComp />
     <Footer/>
    </div>
  )
}

export default CollectionItems