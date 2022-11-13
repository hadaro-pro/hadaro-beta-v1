import React from "react";
import styles from "./infograph.module.scss";


const InfoGraph = ({ heading, topImage, dataArray  }) => {
  return (
    <div className={styles.container}>
      <h2> {heading} </h2>
      <img src={topImage} alt={heading} />

    <div className={styles.sectionCoverMain}>
    <div className={styles.sectionCoverBanner}>
      <div className={styles.sectionCover}>
        {
          dataArray?.map((item, index) => (
            <div className={styles.card} key={index}>
              <div className={styles.imgHolder}>
             <img src={item.image} alt={item.caption}  />
             </div>
             <h4> {item.caption} </h4>
             <p> {item.desc} </p>
            </div> 
          ))
        }
      </div>
      </div>
      </div>
    </div>
  );
};

export default InfoGraph;
