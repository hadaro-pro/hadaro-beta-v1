import React, {useEffect, useState} from 'react'
import axios from 'axios'
import VerificationComp from '../components/VerificationComp/verificationComp'

const VerificationBackOffice = () => {

  const [pendingCollections, setPendingCollections] = useState([])
  const [verifiedCollections, setVerifiedCollections] = useState([])
  const [unVerifiedCollections, setUnVerifiedCollections] = useState([])
  const [pendLoading, setPendLoading] = useState(false)
  const [verifiedLoading, setVerifiedLoading] = useState(false)
  const [unverifiedLoading, setUnverifiedLoading] = useState(false)



 const getAllPendingCollections = async() => {
 
    try {    
  setPendLoading(true)

  // const status = 'verified'

   const getCollections = await axios.post(`/api/fetchCollectionDataByStatus`, {status: 'pending'});

  //  const { data } = getCollections

  const filterDrafts = getCollections.data.filter((item) => !item._id?.includes("drafts"))


  //  console.log("xr", filterDrafts) 

   setPendingCollections(filterDrafts)





  //  console.log('lengthi', singleCollectionDetails)
  setPendLoading(false)
    } catch(e) {
    //  console.error(e)
    }
 }

 const getAllVerifiedCollections = async() => {
 
  try {    
setVerifiedLoading(true)

// const status = 'verified'

 const getCollections = await axios.post(`/api/fetchCollectionDataByStatus`, {status: 'verified'});

//  const { data } = getCollections

const filterDrafts = getCollections.data.filter((item) => !item._id?.includes("drafts"))

//  console.log("xrt", filterDrafts) 

 setVerifiedCollections(filterDrafts)
 




//  console.log('lengthi', singleCollectionDetails)
setVerifiedLoading(false)
  } catch(e) {
  //  console.error(e)
  }
}


const getAllUnVerifiedCollections = async() => {
 
  try {    
setUnverifiedLoading(true)

// const status = 'verified'

 const getCollections = await axios.post(`/api/fetchCollectionDataByStatus`, {status: 'unverified'});

//  const { data } = getCollections

const filterDrafts = getCollections.data.filter((item) => !item._id?.includes("drafts"))


//  console.log("xry", filterDrafts) 



setUnVerifiedCollections(filterDrafts)





//  console.log('lengthi', singleCollectionDetails)
setUnverifiedLoading(false)
  } catch(e) {
  //  console.error(e)
  }
}

  
  useEffect(() => {
    getAllPendingCollections()
    getAllVerifiedCollections()
    getAllUnVerifiedCollections()
  }, [])

  return (
    <div>
      <VerificationComp  pendingCollections={pendingCollections} getPendingCollectionData={getAllPendingCollections}  loadingPendingData={pendLoading} verifiedCollection={verifiedCollections}  getVerifiedCollection={getAllVerifiedCollections} loadingVerifiedData={verifiedLoading}
      unVerifiedCollection={unVerifiedCollections}
       getUnverifiedCollection={getAllUnVerifiedCollections}
      loadingUnverifiedData={unverifiedLoading}
         />
    </div> 
  )
}

export default VerificationBackOffice