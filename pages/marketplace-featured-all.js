import React, { useEffect } from "react";
import Footer from "../components/Footer/footer";
import MarketFeaturedAll from "../components/MarketFeaturedAll/MarketFeaturedAll";
import Navbar from "../components/Navbar/Navbar";
import { useRouter } from "next/router";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { saveLastPageUrl } from "../core/actions/passwordLockActions/passwordLockActions";

const MarketplaceFeaturedAll = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const savedPasswordDetails = useSelector((state) => state.sitePassword);

  const { savedPassword } = savedPasswordDetails;

  // console.log('vgy', savedPassword)
  // console.log('vagygt', savedPasswordDetails)

  const checkForPassword = async (password) => {
    try {
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
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkForPassword(savedPassword);
  }, []);
  return (
    <div>
      <Navbar />
      <MarketFeaturedAll />
      <Footer />
    </div>
  );
};

export default MarketplaceFeaturedAll;
