import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import Image from "next/image";
import Footer from "../components/Footer/footer";
import ExploreCollection from "../components/Homepage/ExploreCollection/exploreCollection";
import InfoSection from "../components/Homepage/InfoSection/infoSection";
import TopSection from "../components/Homepage/TopSection/TopSection";

import { useSelector, useDispatch } from "react-redux";
import { saveLastPageUrl } from "../core/actions/passwordLockActions/passwordLockActions";

import styles from "../styles/Home.module.scss";

export default function Home() {
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Hadaro BETA</title>
        <meta name="description" content="Hadaro NFT Rental" />
        <link rel="icon" href="/hadaro-icon.png" />
      </Head>

      <TopSection />
      <ExploreCollection />
      <InfoSection />
      <Footer />
    </div>
  );
}
