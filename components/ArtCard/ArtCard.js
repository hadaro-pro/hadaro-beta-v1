import React, { useState } from "react";
import styles from "./artcard.module.scss";
import { message, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
const ArtCard = ({
  image,
  title,
  collectionName,
  creatorName,
  bidPrice,
  paymentToken,
  status,
  identity,
  description,
  position,
  openRentModal,
  openFinalModal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // console.log(image)
  // console.log(title)
  // console.log(collectionName)
  // console.log(bidPrice)

  return (
    <div className={styles.mainCover}>
      <img src={image.includes('undefined') ? "/images/no-image-placeholder.png" : image} alt="artwork" />
      <div className={styles.artDesc}>
        <div className={styles.topCaption}>
          <span> {title === null ? "No name" : title} </span>
          <span className={styles.collectionName}> {collectionName} </span>
        </div>
        <div className={styles.captionDetails}>
          <div className={styles.captionDetails1}>
            {status === "lending" ?  <div className={styles.statusOne}>
              <small>Available</small>
            </div> :  <div className={styles.statusTwo}>
              <small>Rented</small>
            </div>}
          </div>
          <div className={styles.captionDetails2}>
            <small>Price</small>
            <div className={styles.captionDetails2Item}>
              <small> {bidPrice} </small>
              <small className={styles.token}> {paymentToken} </small>
            </div>
          </div>
        </div>
        <>
          {status === "lending" ? (
            <button
              onClick={() => {
                openRentModal(position);
                // openFinalModal()
                // showModal();
              }}
            >
              RENT
            </button>
          ) : (
            <button className={styles.disabledRent} disabled={true}>
              RENT
            </button>
          )}
          {/* <Modal
          open={isModalOpen}
          footer={null}
          onCancel={handleCancel}
          className={styles.modalContainer}
        >
          <div className={styles.closeMenu}>
            <CloseOutlined
              className={styles.closeIcon}
              onClick={handleCancel}
            />
          </div>
          <div className={styles.modalContent}>
         <div className={styles.modalContentImage}>
          <img src={`${image}`}  alt="alart" />
         </div>
         <div>
          details part
         </div>
          </div>
        </Modal> */}
        </>
      </div>
    </div>
  );
};

export default ArtCard;
