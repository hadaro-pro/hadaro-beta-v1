import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer/footer";
import Navbar from "../components/Navbar/Navbar";
import NewCollectionComp from "../components/NewCollection/NewCollection";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { saveLastPageUrl } from "../core/actions/passwordLockActions/passwordLockActions";

const NewCollection = () => {
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
        // console.log('rety: ', checkResult)
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
