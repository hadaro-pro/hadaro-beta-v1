export const ipfs_key = process.env.NEXT_PUBLIC_IPFS_DATA_API_KEY

export const nftImageAggregating = (image) => {
  let imageToDisplay;
  if (image?.includes(".")) {
    imageToDisplay = image;
  } else {
    imageToDisplay = "https://ipfs.moralis.io:2053/ipfs/" + image;
  }
  
  if (image?.includes("https://") || image?.includes("data:image/")) {
    imageToDisplay = image;
  } else {
    let splicer = image?.slice(7);
    imageToDisplay = `https://${ipfs_key}.ipfscdn.io/ipfs/` + splicer;
  }
  // https://277da936d0be2a454b83ceb984f218f9.ipfscdn.io/ipfs/QmdLwx8KPLPTYubxn8GrKYib1XYMAPsUQyibCRQ8KUVUb9/2.png

  return imageToDisplay;
};