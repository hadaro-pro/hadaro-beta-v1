export const allNftDataQuery = () => {
  const query = `*[_type == "nftData"] | order(_createdAt desc){
    _id,
    nftAddress,
    tokenID,
    chain,
    transactionType,
    metadataImage
  }`

  return query
}

// export const allCollectionsQuery = () => {
//   const query = `*[_type == "collectionsData"] {
//     _id,
//     collectionAddress,
//     collectionName,
//     collectionSymbol,
//     chain,
//     collectionImage{
//       asset->{
//         _id,
//         url
//       }
//     }
//   }`
//   return query
// }


export const firstNftImageQuery = (contractAddr) => {
  const query = `*[_type == "nftData"  && nftAddress == "${contractAddr}"] | order(_createdAt desc){
    _id,
    metadataImage,
    transactionType
  }`
  return query
}


// export const allCollectionsQuery = () => {
//   const query = `*[_type == "freshcollectionsData"] {
//     _id,
//     collectionAddress,
//     collectionName,
//     collectionSymbol,
//     chain,
//     collectionImage,
//     collectionDesc,
//     status,
//     itemCount
//   }`
//   return query
// }

export const allTestCollectionsQuery = () => {
  const query = `*[_type == "testcollectionsData"] {
    _id,
    collectionAddress,
    collectionName,
    collectionSymbol,
    chain,
    collectionImage,
    collectionDesc,
    status,
    itemCount
  }`
  return query
}


export const statusOfCollectionsQuery = (status) => {
  const query = `*[_type == "testcollectionsData" && status == '${status}'] {
    _id,
    collectionAddress,
    collectionName,
    collectionSymbol,
    chain,
    collectionImage,
    collectionDesc,
    itemCount,
    status,
    notes
  }`
  return query
}


  export const firstNftByCollectionQuery = (contractAddr) => {
    const query = `*[_type == "nftData" ] | order(_createdAt desc){
      _id,
      nftAddress,
      tokenID,
      chain
    }`

  return query
}





export const allNftsByCollectionQuery = (contractAddr) => {
  const query = `*[_type == "testNftData"] {
    _id,
    nftAddress,
    tokenID,
    chain,
    transactionType,
    lenderAddress,
    price,
    status,
    paymentToken,
    maxDuration,
    metadataImage,
    metadataDesc,
    metadataName,
    nftStandard,
    nftCollectionName,
    renterAddress
  }`

return query
}



export const walletAvatarQuery = (walletaddr) => {
  const query = `*[_type == "walletAvatarData" && walletAddress == "${walletaddr}"] | order(_createdAt desc) {
    _id,
    walletAddress,
    walletAvatar,
  }`

return query
}


export const getItemCollectionCountQuery = (collectionAddr) => {
  const query = `*[_type == "testcollectionsData"] | order(_createdAt desc) {
    _id,
    itemCount,
    collectionAddress
  }`

return query
}


export const allMainNftsByCollectionQuery = (contractAddr) => {
  const query = `*[_type == "testNftData" && nftAddress == "${contractAddr}"] {
    _id,
    nftAddress,
    tokenID,
    chain,
    transactionType,
    lenderAddress,
    price,
    status,
    paymentToken,
    maxDuration,
    metadataImage,
    metadataDesc,
    metadataName,
    nftStandard,
    nftCollectionName,
    transactionHash,
    rentTransactionHash,
    noOfRentDays,
    timeOfRent,
    renterAddress
  }`

return query
}


export const allLendedNftsByAddressQuery = (lenderAddr) => {
  const query = `*[_type == "testNftData"   && lenderAddress == '${lenderAddr}'] {
    _id,
    nftAddress,
    tokenID,
    chain,
    transactionType,
    lenderAddress,
    price,
    status,
    paymentToken,
    maxDuration,
    metadataImage,
    metadataDesc,
    metadataName,
    nftStandard,
    nftCollectionName,
    transactionHash,
    rentTransactionHash,
    renterAddress,
    noOfRentDays,
    timeOfRent,
    isRentClaimed,
  }`
return query
}

export const allRentedNftsByAddressQuery = (renterAddr) => {
  const query = `*[_type == "testNftData"  && renterAddress == '${renterAddr}' && transactionType == "lending renting"] {
    _id,
    nftAddress,
    tokenID,
    chain,
    transactionType,
    status,
    lenderAddress,
    price,
    paymentToken,
    maxDuration,
    metadataImage,
    metadataDesc,
    metadataName,
    nftStandard,
    nftCollectionName,
    renterAddress,
    noOfRentDays,
    timeOfRent,
    rentTransactionHash,
    transactionHash,
    isRentClaimed,
  }`
return query
}



