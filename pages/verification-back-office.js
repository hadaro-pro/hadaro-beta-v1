import React, {useEffect, useState} from 'react'
import axios from 'axios'
import VerificationComp from '../components/VerificationComp/verificationComp'

const VerificationBackOffice = () => {

  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(false)



 const getAllCollections = async() => {
 
    try {    
  setLoading(true)

  // const status = 'verified'

   const getCollections = await axios.post(`/api/fetchCollectionDataByStatus`, {status: 'pending'});

  //  const { data } = getCollections

  //  console.log("xr", getCollections.data) 

   setCollections(getCollections.data)





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
      <VerificationComp  pendingCollections={collections} getCollectionData={getAllCollections}  loadingData={loading} />
    </div>
  )
}

export default VerificationBackOffice