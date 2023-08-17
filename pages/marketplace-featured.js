import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar/Navbar";
import MarketFeatured from "../components/MarketFeatured/marketFeatured";
import Footer from "../components/Footer/footer";
import { saveCollectionItemDetails } from "../core/actions/collectionActions.js/collectionActions";
import { saveLastPageUrl } from "../core/actions/passwordLockActions/passwordLockActions";

const MarketplaceFeatured = () => {
  const [collections, setCollections] = useState([]);
  const [imageArr, setImageArr] = useState([]);
  const [singleCollectionDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  // console.log('frem', singleCollectionDetails)

  const dispatch = useDispatch();
  const router = useRouter();

  const savedPasswordDetails = useSelector((state) => state.sitePassword);

  const { savedPassword } = savedPasswordDetails;

  // console.log('vgy', savedPassword)
  // console.log('vagygt', savedPasswordDetails)

  const checkForPassword = async (password) => {
    try {
      if (savedPassword === null) {
        dispatch(saveLastPageUrl(router.pathname));
        router.push("/password-lock");
      } else {
        const fetchedPassword = await axios.post(`/api/fetchPassword`);
        const passDetails = fetchedPassword.data[0]?.password;
        // console.log('pass', passDetails)
        const checkPass = await axios.post(`/api/checkPassword`, {
          fetchedPassword: passDetails,
          password: savedPassword,
        });
        const checkResult = checkPass.data?.msg;
        //  console.log('rety: ', checkResult)
        if (password === undefined || password === null || !checkResult) {
          dispatch(saveLastPageUrl(router.pathname));
          router.push("/password-lock");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };  

  useEffect(() => {
    checkForPassword(savedPassword);
  }, []);

  // const sharpSTuff = async() => {
  //   try {
  //     const res = await axios.post(`/api/postCollectionsData`);
  //     console.log('for collectionDelete', res.data);
  //   } catch(e) {
  //     console.warn(e)
  //   }
  // }

  // const extractMetaData = async (nftObj) => {
  //   const nftAddress = nftObj?.nftAddress;
  //   const tokenID = nftObj?.tokenID;
  //   const chain = nftObj?.chain;

  //   const metaData = await axios.get(`/api/fetchSingleNftMeta`, {
  //     params: {
  //       tokenAddr: nftAddress,
  //       tokenID: tokenID,
  //       chain: chain,
  //     },
  //   });

  //   return metaData;
  // };

  // const getFirstNftImage = async(address) => {
  //   try{

  //     const response = await axios.post(`/api/fetchSingleImage`, {address} )

  //     console.log(response.data)
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }

  // useEffect(() => {
  //  getFirstNftImage(colAddr)
  // }, [])

  const getAllCollections = async () => {
    let mainArrItems = [];
    let imagesArr = [];

    try {
      setLoading(true);

      // const status = 'verified'

      const getCollections = await axios.post(
        `/api/fetchCollectionDataByStatus`,
        { status: "verified" }
      );

      const filteredCollections = getCollections.data?.filter(
        (item) => item.status === "verified" && !item._id.includes("drafts")
      );

      //  const { data } = getCollections

      //  console.log("xr", getCollections.data)

      filteredCollections.forEach(async (item) => {
        const addr = item.collectionAddress.toLowerCase();
        // const getfirstNft = await axios.post(`/api/fetchSingleImage`, { addr });

        // const filterPart = getfirstNft.data.filter(
        //   (item) =>
        //     item.transactionType === "lending" ||
        //     (item.transactionType === "renting" && !item._id.includes("drafts"))
        // );
        // // console.log("xr", filterPart)
        // // console.log(filterPart?.length)
        // // singleCollectionDetails.push({imageNft: filterPart[0]?.metadataImage})
        // imagesArr.push({ imageNft: filterPart[0]?.metadataImage });
      });

      setImageArr(imagesArr);

      //  console.log('dff', imagesArr)

      setCollections(filteredCollections);

      //  data?.forEach(async(el) => {
      //   // console.log('el: ',el.collectionAddress)
      //   const contractAddr = el?.collectionAddress
      //        const getFirstNft = await axios.post(`/api/fetchSingleNft`, {contractAddr})

      //     // console.log('nftdets', getFirstNft?.data)

      //     const nftImage = await extractMetaData(getFirstNft?.data)

      //     // console.log('nftimageMeta: ', nftImage?.data?.metadata?.image)

      //     // console.log('xr', nftImage)

      //     let image = nftImage?.data?.metadata?.image

      //     // console.log('xr', image)

      //     let metaImg = ''

      //     if(image?.includes(".")) {
      //       metaImg = image
      //     } else {
      //       metaImg =  "https://ipfs.moralis.io:2053/ipfs/" + image;
      //     }

      //     if(image?.includes("https://") || image?.includes("data:image/")) {
      //       metaImg = image;
      //     } else {
      //       let splicer =  image?.slice(7)
      //       metaImg =  "https://gateway.ipfscdn.io/ipfs/" + splicer;

      //     }

      //     // console.log('metaIbh: ', metaImg)

      //     // singleCollectionDetails.push({parsedImage: metaImg})
      //     mainArrItems.push({metaImg})
      //  } )

      //  console.log('gerty', mainArrItems)

      //  for (let index = 0; index < data.length; index++) {
      //     const contractAddr = data[index].collectionAddress

      //     // console.log('contrAse: ', contractAddr)

      //     const getFirstNft = await axios.get(`/api/fetchSingleNft`, contractAddr)

      //     console.log('nftdets', getFirstNft)

      //     // singleCollectionDetails?.push(getFirstNft)
      //  }

      //  console.log(collections)

      dispatch(saveCollectionItemDetails(mainArrItems));

      //  console.log('lengthi', singleCollectionDetails)
      setLoading(false);
    } catch (e) {
      //  console.error(e)
    }
  };

  const getAllCollections_noLoad = async () => {
    let mainArrItems = [];
    let imagesArr = [];

    try {
      
      const getCollections = await axios.post(
        `/api/fetchCollectionDataByStatus`,
        { status: "verified" }
      );

      const filteredCollections = getCollections.data?.filter(
        (item) => item.status === "verified" && !item._id.includes("drafts")
      );

      filteredCollections.forEach(async (item) => {
        const addr = item.collectionAddress.toLowerCase();
      });

      setImageArr(imagesArr);

      setCollections(filteredCollections);

      dispatch(saveCollectionItemDetails(mainArrItems));

    } catch (e) {
      //  console.error(e)
    }
  };


  useEffect(() => {
    getAllCollections();
  }, []);

    // Make API call on a 1 minute interval
useEffect(() => {
  const interval = setInterval(async () => {
    await getAllCollections_noLoad()
    // console.log('refreshed')
  }, 60000);

  return () => {
    clearInterval(interval);
  }
}, []);

  return (
    <div>
      <Navbar />
      <MarketFeatured
        storeCollections={collections}
        // imagesArray={imageArr}
        loadingCollections={loading}
      />
      {/* <button onClick={sharpSTuff}>
        delete
      </button> */}
      <Footer />
    </div>
  );
};

export default MarketplaceFeatured;
