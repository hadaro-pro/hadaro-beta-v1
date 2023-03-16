import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer/footer";
import Navbar from "../components/Navbar/Navbar";
import NewCollectionComp from "../components/NewCollection/NewCollection";

const NewCollection = () => {
  const [verifiedCollectionsArray, setVerifiedCollectionsArray] = useState([]);

  // console.log('bracka', verifiedCollectionsArray)

  const getAllCollections = async () => {
    let mainArrItems = [];

    try {
      const getCollections = await axios.get(`/api/fetchCollectionData`);

      //  console.log('xacv', getCollections.data)

      getCollections?.data.forEach((item) => {
        mainArrItems.push(item.collectionAddress.toLowerCase());
      });

      setVerifiedCollectionsArray(mainArrItems);
    } catch (e) {
      // console.error(e)
    }
  };

  useEffect(() => {
    getAllCollections();
  }, []);

  return (
    <div>
      <Navbar />
      <NewCollectionComp inHouseCollections={verifiedCollectionsArray} />
      <Footer />
    </div>
  );
};

export default NewCollection;
