export const allNftDataQuery = () => {
  const query = `*[_type == "nftData"] | order(_createdAt desc){
    _id,
    nftAddress,
    tokenID,
    chain,
    transactionType,
    metadataImage
  }`;

  return query;
};

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
  }`;
  return query;
};

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
    itemCount,
    apiKey,
    apiKeyCreationDate
  }`;
  return query;
};

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
    notes,
    apiKey,
    apiKeyCreationDate
  }`;
  return query;
};

export const firstNftByCollectionQuery = (contractAddr) => {
  const query = `*[_type == "nftData" ] | order(_createdAt desc){
      _id,
      nftAddress,
      tokenID,
      chain
    }`;

  return query;
};

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
  }`;

  return query;
};

export const walletAvatarQuery = (walletaddr) => {
  const query = `*[_type == "walletAvatarData" && walletAddress == "${walletaddr}"] | order(_createdAt desc) {
    _id,
    walletAddress,
    walletAvatar,
  }`;

  return query;
};

// export const collectionImageQuery = (collectionaddr) => {
//   const query = `*[_type == "collectionImageData" && walletAddress == "${collectionaddr}"] | order(_createdAt desc) {
//     _id,
//     collectionAddress,
//     collectionImaAvatar,
//   }`

// return query
// }

export const getItemCollectionCountQuery = (collectionAddr) => {
  const query = `*[_type == "testcollectionsData"] | order(_createdAt desc) {
    _id,
    itemCount,
    collectionAddress
  }`;

  return query;
};

export const getItemDetailsQuery = (id) => {
  const query = `*[_type == "testBlockNftData" && _id == "${id}"] | order(_createdAt desc) {
    _id,
    transactionType
  }`;

  return query;
};




// consider this for adjustment - test for new method of chain data
export const allMainNftsByCollectionQuery = (contractAddr) => {
  const query = `*[_type == "testBlockNftData" && nftAddress == "${contractAddr}"] {
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
    lendTransactionHash,
    noOfRentDays,
    timeOfRent,
    renterAddress,
    lendingID,
    rentingID,
    lendAmount,
    rentAmount
  }`;

  return query;
};

// consider this for adjustment - test for new method of chain data
export const allLendedNftsByAddressQuery = (lenderAddr) => {
  const query = `*[_type == "testBlockNftData"   && lenderAddress == '${lenderAddr}'] {
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
    lendingID,
    rentingID,
    renterAddress,
    noOfRentDays,
    timeOfRent,
    isRentClaimed,
    lendTransactionHash,
    rentTransactionHash
  }`;
  return query;
};


export const nftByLendingIDQuery = (lendingID) => {
  const query = `*[_type == "testBlockNftData"   && lendingID == '${lendingID}'  && transactionType == "lending"] {
    _id,
    transactionType,
    nftAddress
  }`;
  return query;
};


export const nftByRentingIDQuery = (rentingID) => {
  const query = `*[_type == "testBlockNftData"   && rentingID == '${rentingID}'  && transactionType == "lending renting"] {
    _id,
    transactionType,
    timeOfRent,
    noOfRentDays,
  }`;
  return query;
};


export const nftByOnlyLendingIDQuery = (lendingID) => {
  const query = `*[_type == "testBlockNftData"   && lendingID == '${lendingID}'] {
    _id,
    transactionType,
  }`;
  return query;
};

// consider this for adjustment - test for new method of chain data
export const allRentedNftsByAddressQuery = (renterAddr) => {
  const query = `*[_type == "testBlockNftData"  && renterAddress == '${renterAddr}' && transactionType == "lending renting"] {
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
    lendingID,
    rentingID,
    isRentClaimed,
    lendTransactionHash,
    rentTransactionHash
  }`;
  return query;
};

export const siteDataQuery = () => {
  const query = `*[_type == "sitePassword"] | order(_createdAt desc){
    _id,
    password
  }`;

  return query;
};



export const getCollectionByCollectionAddr = (collectionAddr) => {
  const query = `*[_type == "testcollectionsData" && collectionAddress == '${collectionAddr}'] | order(_createdAt desc) {
    _id,
    apiKey
  }`;

  return query;
};



export const allRentingNftsByColAddressQuery = (collectionAddr) => {
  const query = `*[_type == "testBlockNftData"   && nftAddress == '${collectionAddr}' && transactionType == "lending renting"] {
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
    lendingID,
    rentingID,
    renterAddress,
    noOfRentDays,
    timeOfRent,
    isRentClaimed,
  }`;
  return query;
};


export const singleRentingNftByColAddressQuery = (collectionAddr, renterAddr) => {
  const query = `*[_type == "testBlockNftData"   && nftAddress == '${collectionAddr}' && renterAddress == '${renterAddr}'  && transactionType == 'lending renting'] {
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
    lendingID,
    rentingID,
    renterAddress,
    noOfRentDays,
    timeOfRent,
    isRentClaimed,
  }`;
  return query;
};


export const allLendingNftsByColAddressQuery = (collectionAddr) => {
  const query = `*[_type == "testBlockNftData"   && nftAddress == '${collectionAddr}' && transactionType == 'lending'] {
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
    lendingID,
    rentingID,
    renterAddress,
    noOfRentDays,
    timeOfRent,
    isRentClaimed,
  }`;
  return query;
};


export const singleLendingNftByColAddressQuery = (collectionAddr, lenderAddr) => {
  const query = `*[_type == "testBlockNftData"   && nftAddress == '${collectionAddr}' && lenderAddress == '${lenderAddr}'  && transactionType == 'lending'] {
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
    lendingID,
    rentingID,
    renterAddress,
    noOfRentDays,
    timeOfRent,
    isRentClaimed,
  }`;
  return query;
};