import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./newCollection.module.scss";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import {
  useAccount,
  useConnect,
  useSigner,
  useProvider,
  erc721ABI,
} from "wagmi";
import { client } from "../../utils/client";
import { message } from "antd";

const NewCollectionComp = ({ inHouseCollections }) => {
  const [loading, setLoading] = useState(false);
  const [captchaSorted, setCaptchaSorted] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [chain, setChain] = useState("0x5");
  const [collectionName, setCollectionName] = useState("");
  const [collectionSymbol, setCollectionSymbol] = useState("");
  const [contractAddr, setcontractAddr] = useState("");
  const [collectionDesc, setCollectionDesc] = useState("");

  const router = useRouter();

  const { address, isConnected } = useAccount();
  
  const key = "6LcutQ8kAAAAAIhv8K59NJVYPKEKFiJ7UOzntM14";

  //   const uploadImage = async(e) => {
  //     const selectedFile = e.target.files[0]
  //     // console.log('seas', selectedFile)
  //     const fileTypes = ['image/jpeg', 'image/png', 'image/svg']

  //     if(fileTypes.includes(selectedFile.type)) {
  //         client.assets.upload('image', selectedFile, {
  //           contentType: selectedFile.type,
  //           filename: selectedFile.name,
  //         })
  //         .then((data) => {
  //           setImageAsset(data)
  //           message.info('image upload success')
  //         })
  //     } else {
  //       message.error('unsupported image type!')
  //     }
  // }

  const handleSubmit = async () => {
    const document = {
      _type: "testcollectionsData",
      collectionName: collectionName,
      collectionSymbol: collectionSymbol,
      collectionAddress: contractAddr.toLowerCase(),
      chain: chain,
      collectionDesc: collectionDesc,
      itemCount: String(0),
      status: "pending",
    };

    let collectionNfts = [];
    try {
      setLoading(true);
      if (inHouseCollections?.includes(contractAddr.toLowerCase())) {
        message.warn("This collection already exists in our database!");
        setLoading(false);
      } else {
        if (
          collectionName === "" ||
          collectionDesc === "" ||
          contractAddr === ""
        ) {
          message.error("All form fields must be filled");
          setLoading(false);
        } else {
          const response = await axios.get("/api/get-nft-owner-collections", {
            params: {
              walletaddr: address,
              // walletaddr: wallet,
              chain: chain,
            },
          });

          const res = response.data.result;

          for (let index = 0; index <= res.length; index++) {
            collectionNfts.push(res[index]?.token_address);
          }

          //  console.log('ehad',collectionNfts)

          if (!collectionNfts.includes(contractAddr.toLowerCase())) {
            message.error("You are not the NFT collection owner!");
            setLoading(false);
          } else {
            const sendData = await axios.post(
              `/api/postFreshCollectionData`,
              document
            );

            // console.log(sendData.data);
            if (sendData.data) {
              message.info("Your submission is pending verification");
            }

            // setImageAsset(null)
            setCollectionName("");
            setCollectionDesc("");
            setCollectionSymbol("");
            setcontractAddr("");
            // message.success('Your submission has been verified')
            setLoading(false);
            router.push("/");
          }
        }
      }
    } catch (e) {
      // console.error(e)
      setLoading(false);
    }
  };

  const onChange = async (value) => {
    setCaptchaSorted(true);
    // console.log("Captcha value:", value);
    // console.log(captchaSorted)
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.caption}>
        <h1>Collection Details</h1>
      </div>

      <div className={styles.mainPartUmbrella}>
        <div className={styles.mainPartInner}>
          <div className={styles.formUpperPart}>
            <div className={styles.formUpperName}>
              <div className={styles.formUpperNameFill}>
                <h3>Name</h3>
                <input
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                />
              </div>
              <div className={styles.formUpperNameFill}>
                <h3>Contract Address</h3>
                <input
                  type="text"
                  value={contractAddr}
                  onChange={(e) => setcontractAddr(e.target.value)}
                />
              </div>
              <div className={styles.formUpperNameFill}>
                <h3>Token Symbol</h3>
                <input
                  type="text"
                  value={collectionSymbol}
                  onChange={(e) => setCollectionSymbol(e.target.value)}
                />
              </div>
            </div>
            {/* <div className={styles.formUpperImageUpload}>
              <div className={styles.formUpperImageContainer}>
                <label className={styles.formUpperImageDiv}  htmlFor="imagefiles" >
                { imageAsset !== null ? <img src={imageAsset?.url} alt="image"   className={styles.imgUpload} />  : <img src="/images/cross.png" alt="image"  />}
                </label>
                <input id="imagefiles" type="file"   onChange={(e) => {setImageFile(e.target.files[0])
                uploadImage(e)
                }} />
                <h2>official image upload</h2>
              </div>
            </div> */}
          </div>
          <div className={styles.formLowerPart}>
            <div className={styles.formLowerDescFill}>
              <h3>Description</h3>
              <textarea
                value={collectionDesc}
                onChange={(e) => setCollectionDesc(e.target.value)}
              ></textarea>
            </div>
            <div className={styles.captcha}>
              <ReCAPTCHA sitekey={key} onChange={onChange} />
            </div>
          </div>
          <div className={styles.formButtonPart}>
            {captchaSorted === true ? (
              <button
                onClick={() => {
                  if (isConnected) {
                    handleSubmit();
                  } else {
                    message.error("Connect your wallet to continue!");
                  }
                }}
              >
                {" "}
                {loading ? "Processing" : "Submit"}
              </button>
            ) : (
              <button disabled={true}>Submit</button>
            )}{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCollectionComp;
