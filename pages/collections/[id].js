import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useRouter } from "next/router";
import { saveLastPageUrl } from "../../core/actions/passwordLockActions/passwordLockActions";
import CollectionItemsComp from "../../components/CollectionItemsComp/collectionItemsComp";
import Footer from "../../components/Footer/footer";
import Navbar from "../../components/Navbar/Navbar";


const CollectionItems = () => {
  const [finalCollectionItems, setFinalCollectionItems] = useState(null);

  const [loading, setLoading] = useState(false);

  const [sealFooter, setSealFooter] = useState(false);
const dispatch = useDispatch();
const router = useRouter()

const savedPasswordDetails = useSelector((state) => state.sitePassword)

const {savedPassword} = savedPasswordDetails

// console.log('vgy', savedPassword)
// console.log('vagygt', savedPasswordDetails)

const checkForPassword = async(password) => {
  try{
    const fetchedPassword = await axios.post(`/api/fetchPassword`)
    const passDetails = fetchedPassword.data[0]?.password
    // console.log('pass', passDetails)
    const checkPass = await axios.post(`/api/checkPassword`, {fetchedPassword: passDetails, password: savedPassword})
    const checkResult = checkPass.data?.msg
    // console.log('rety: ', checkResult)
    if(password === undefined || password === null || !checkResult) {
      dispatch(saveLastPageUrl('/marketplace-featured'))
      router.push('/password-lock')
    } 
  }catch(e) {
    console.error(e)
  }
}


useEffect(()=> {
  checkForPassword(savedPassword)
}, [])


  const collectionDetails = useSelector((state) => state.collectionDetails);

  const { collectionInfo } = collectionDetails;

  const { colAddress } = collectionInfo;

  // console.log('addr: ', colAddress)

  const extractMetaData = async (nftObj) => {
    const { nftAddress, tokenID, chain } = nftObj;

    const metaData = await axios.get(`/api/fetchSingleNftMeta`, {
      params: {
        tokenAddr: nftAddress,
        tokenID: tokenID,
        chain: chain,
      },
    });

    return metaData;
  };

  const fetchCollectionNfts = async () => {
    try {
      setLoading(true);
      const contractAddr = colAddress.toLowerCase();

      // console.log('contadrt: ', contractAddr)
      const response = await axios.post(`/api/fetchMainNftsInCollection`, {
        contractAddr,
      });

      // const filterByContractAddr = response.data?.filter((item) => item.nftAddress.toLowerCase() === contractAddr.toLowerCase())

      // console.log(response.data)

      const filterByActivity = response.data?.filter(
        (item) =>
          item.transactionType === "lending" ||
          item.transactionType === "lending renting"
      );

      // previousListed for lending
      // console.log('filtration', filterByActivity)

      //   console.log('resti: ', response.data)

      setFinalCollectionItems(filterByActivity);

      setLoading(false);
    } catch (err) {
      // console.error(err)
    }
  };

  useEffect(() => {
    fetchCollectionNfts();
  }, []);

  return (
    <div>
      <Navbar />
      <CollectionItemsComp
        openFooter={setSealFooter}
        loadingItems={loading}
        itemsToDisplay={finalCollectionItems}
        getRefreshItems={fetchCollectionNfts}
      />
      <Footer />
    </div>
  );
};

export default CollectionItems;
