export const allNftDataQuery = () => {
  const query = `*[_type == "nftData"] | order(_createdAt desc){
    _id,
    nftAddress,
    tokenID,
    chain,
    transactionType
  }`

  return query
}

export const allCollectionsQuery = () => {
  const query = `*[_type == "collectionsData"] {
    _id,
    collectionAddress,
    collectionName,
    collectionSymbol,
    chain,
    collectionAddress
  }`
  return query
}

  export const firstNftByCollectionQuery = (contractAddr) => {
    const query = `*[_type == "nftData" 
    && nftAddress == '${contractAddr}'] | order(_createdAt desc){
      _id,
      nftAddress,
      tokenID,
      chain
    }[0]`
  
    // `*[_type == "nftData" && nftAddress == "${colAddr}" ] | order(_createdAt desc) {
    //   _id,
    //   nftAddress,
    //   tokenID,
    //   chain
    // }`

  return query
}




