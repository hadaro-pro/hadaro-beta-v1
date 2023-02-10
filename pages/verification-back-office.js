import React, {useEffect, useState} from 'react'
import axios from 'axios'
import VerificationComp from '../components/VerificationComp/verificationComp'

const VerificationBackOffice = () => {

  const [pendingCollections, setPendingCollections] = useState([])
  const [verifiedCollections, setVerifiedCollections] = useState([])
  const [pendLoading, setPendLoading] = useState(false)
  const [verifiedLoading, setVerifiedLoading] = useState(false)



 const getAllPendingCollections = async() => {
 
    try {    
  setPendLoading(true)

  // const status = 'verified'

   const getCollections = await axios.post(`/api/fetchCollectionDataByStatus`, {status: 'pending'});

  //  const { data } = getCollections

  //  console.log("xr", getCollections.data) 

   setPendingCollections(getCollections.data)





  //  console.log('lengthi', singleCollectionDetails)
  setPendLoading(false)
    } catch(e) {
     console.error(e)
    }
 }

 const getAllVerifiedCollections = async() => {
 
  try {    
setVerifiedLoading(true)

// const status = 'verified'

 const getCollections = await axios.post(`/api/fetchCollectionDataByStatus`, {status: 'verified'});

//  const { data } = getCollections

//  console.log("xr", getCollections.data) 

 setVerifiedCollections(getCollections.data)





//  console.log('lengthi', singleCollectionDetails)
setVerifiedLoading(false)
  } catch(e) {
   console.error(e)
  }
}

  
  useEffect(() => {
    getAllPendingCollections()
    getAllVerifiedCollections()
  }, [])

  return (
    <div>
      <VerificationComp  pendingCollections={pendingCollections} getPendingCollectionData={getAllPendingCollections}  loadingPendingData={pendLoading} verifiedCollection={verifiedCollections}  getVerifiedCollection={getAllVerifiedCollections} loadingVerifiedData={verifiedLoading}
         />
    </div> 
  )
}

export default VerificationBackOffice