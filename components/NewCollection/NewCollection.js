import React, { useState } from "react";
import styles from "./newCollection.module.scss";
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios'
import { useAccount, useConnect, useSigner, useProvider, erc721ABI } from "wagmi";
import { message } from "antd";

const NewCollectionComp = () => {
  const [captchaSorted, setCaptchaSorted] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [chain, setChain] = useState("0x1")
  const [collectionName, setCollectionName] = useState("");
  const [contractAddr, setcontractAddr] = useState("");
  const [collectionDesc, setCollectionDesc] = useState("")
  


  const { address,isConnected } = useAccount();


  if (imageFile !== null) {
    // console.log(imageFile[0]?.name)
  }
  
  const key = '6LcutQ8kAAAAAIhv8K59NJVYPKEKFiJ7UOzntM14'


  const handleSubmit = async() => {

  
    const document = {
      _type: "pendingCollectionData",
      
    }


    let  collectionNfts = []  
    try {

      if(imageFile === null || collectionName === "" || collectionDesc === "" || contractAddr === "" ) {
        message.error('All form fields must be filled and image uploaded')
      } else {
        const response = await axios.get("/api/get-nft-owner-collections", {
          params: {
            walletaddr: address,
            // walletaddr: wallet,
            chain: chain,
          },
        }); 
  
        const res = response.data.result
  
        for(let index = 0; index <= res.length; index++) {
          collectionNfts.push(res[index]?.token_address)
        }
  
        //  console.log(response.data.result)
  
        if(collectionNfts.includes(contractAddr)) {
          message.success('submission success! pending verification')
        } else {
          message.error('You are not the NFT collection owner!')
        }

        const sendData = await axios.post(`/api/postPendingCollectionData`, document);

        // console.log(sendData.data);

      }

    } catch(e) {
      console.error(e)
    }
  }

  const onChange =  async(value) => {
    setCaptchaSorted(true)
    // console.log("Captcha value:", value);
    // console.log(captchaSorted)
  }

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
                <input type="text"  value={collectionName} onChange={(e) => setCollectionName(e.target.value)} />
              </div>
              <div className={styles.formUpperNameFill}>
                <h3>Contract Address</h3>
                <input type="text"  value={contractAddr} onChange={(e) => setcontractAddr(e.target.value)} />
              </div>
            </div>
            <div className={styles.formUpperImageUpload}>
              <div className={styles.formUpperImageContainer}>
                <label className={styles.formUpperImageDiv}  htmlFor="imagefiles" >
                { imageFile !== null ? <img src={`${URL.createObjectURL(imageFile)}`} alt="image"   className={styles.imgUpload} />  : <img src="/images/cross.png" alt="image"  />}
                </label>
                <input id="imagefiles" type="file" accept="image/png, image/jpeg, image/svg"   onChange={(e) => setImageFile(e.target.files[0])} />
                <h2>Upload cover image</h2>
              </div>
            </div>
          </div>
          <div className={styles.formLowerPart}>
            <div className={styles.formLowerDescFill}>
              <h3>Description</h3>
              <textarea value={collectionDesc} onChange={(e) => setCollectionDesc(e.target.value)} ></textarea>
            </div>
            <div className={styles.captcha} >
              <ReCAPTCHA sitekey={key} onChange={onChange} />
            </div>
          </div>
          <div className={styles.formButtonPart}>
         { captchaSorted === true ?  <button onClick={() => {handleSubmit()}}>Submit</button> : <button 
           disabled={true}>Submit</button>
}          </div> 
        </div>
      </div>
    </div>
  );
};

export default NewCollectionComp;
