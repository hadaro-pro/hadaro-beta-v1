import React, { useState } from "react";
import styles from "./newCollection.module.scss";
import ReCAPTCHA from "react-google-recaptcha";
import { message } from "antd";

const NewCollectionComp = () => {
  const [captchaSorted, setCaptchaSorted] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [contractAddr, setcontractAddr] = useState("");
  const [collectionDesc, setCollectionDesc] = useState("")
  



  // console.log(imageFile)

  const key = '6LcutQ8kAAAAAIhv8K59NJVYPKEKFiJ7UOzntM14'


  const handleSubmit = async() => {
    message.success('submission success! pending verification')
  }

  const onChange =  async(value) => {
    setCaptchaSorted(true)
    console.log("Captcha value:", value);
    console.log(captchaSorted)
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
                  <img src="/images/cross.png" alt="image"  />
                </label>
                <input id="imagefiles" type="file" accept="image/png, image/jpeg, image/svg"   onChange={(e) => setImageFile(e.target.files)} />
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
         { captchaSorted === true ?  <button onClick={() => {handleSubmit()}}  >Submit</button> : <button 
           disabled={true}>Submit</button>
}          </div> 
        </div>
      </div>
    </div>
  );
};

export default NewCollectionComp;
