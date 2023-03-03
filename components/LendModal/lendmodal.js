import React, { useState, useEffect } from "react";
import { Modal, message, Select } from "antd";
import { useConnect, useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { Sylvester, PaymentToken } from "@renft/sdk";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import styles from "./lendmodal.module.scss";

const LendModal = ({
  modalOpen,
  cancelModal,
  lendItemObject,
  setLendItemObject,
  openCheckout,
  displayOutroPart,
  loadingTxn,
}) => {
  const { isConnected, address } = useAccount();

  const [size, setSize] = useState("middle");
  const [dailyRentPrice, setDailyRentPrice] = useState(0);
  // const [nftPrice, setNftPrice] = useState("0")
  const [rentError, setRentError] = useState("");
  // const [collateralError, setCollateralError] = useState("")
  const [rentDaysError, setRentDaysError] = useState("");
  const [maxRentDuration, setMaxRentDuration] = useState(0);
  //  console.log('maxRentDurationerr', rentDaysError)
  //  console.log(collateralError)
  //  console.log(rentDaysError)

  // console.log(maxRentDuration)

  // console.log(nftPrice)
  // console.log(dailyRentPrice)
  const { chains: netChain, error, isLoading, pendingChainId, switchNetwork } =
  useSwitchNetwork()

  const { chain: mainChain, chains } = useNetwork();

  const handleMaxRentDuration = (value) => {
    // setMaxRentDuration(String(value))
    const str = String(value);
    if (str == "0" || str == "NaN" || str.charAt(0) === "-") {
      setRentDaysError("value cannot be zero or out of range");
    } else {
      setLendItemObject({ ...lendItemObject, maxRentDuration: Number(value) });
      setRentDaysError(null);
    }
  };

  const handlePaymentTokenChange = (value) => {
    // console.log(value);
    setLendItemObject({ ...lendItemObject, paymentToken: value });
  };

  function isNumber(value) {
    if (value === "" || value === " " || value === "0") {
      return "value cannot be empty or zero or negative";
    } else {
      if (Number.isFinite(Number(value)) == true) {
        return Number(value);
      } else {
        return "only numbers are allowed";
      }
    }
  }

  // const handleCollateral = (value) => {
  //   console.log(value)
  //   if (value == 0 || isNaN(value) == true || String(value).charAt(0) == "-" ) {
  //     setCollateralError("value cannot be non-zero or out of range")
  //   } else{
  //     setLendItemObject({ ...lendItemObject, nftPrice: Number(value) })
  //     setCollateralError(null)
  //   }
  // }

  const handleDailyRentalPrice = (value) => {
      setLendItemObject({ ...lendItemObject, dailyRentPrice: value });

  };

  const addCollateralAndLendPrice = () => {
    // console.log(lendItemObject);
    const { nftPrice, dailyRentPrice, maxRentDuration, paymentToken } =
      lendItemObject;

      const parts = dailyRentPrice.toString().split('.')
      const whole = parts[0]
      const decimals = parts[1]

    // Ethereum

    if (dailyRentPrice === 0 || maxRentDuration === 0 || paymentToken === "") {
      message.error("all form fields must be filled");
    } else if (mainChain?.name !== "Goerli") {
      console.log(mainChain?.name)
      message.error("Please Connect to the Goerli Testnet to proceed", [3]);
    } else if (Number(whole) !== 0) {
      message.error("Price supplied too high");
    }  else if ( decimals.length > 4) {
      message.error("Price supplied too low");
    }
    else {
      displayOutroPart(true);
      openCheckout();
    }
  };


 

  return (
    <Modal
      open={modalOpen}
      footer={null}
      onCancel={cancelModal}
      className={styles.mainContainer}
    >
      <div className={styles.closeMenu}>
        <CloseOutlined className={styles.closeIcon} onClick={cancelModal} />
      </div>
      <div className={styles.mainForm}>
        <h3>Lend your NFT and earn passive income.</h3>

        <div className={styles.mainFormOptions}>
          <small>Select Payment Token</small>
          <Select
            size={size}
            defaultValue={1}
            onChange={handlePaymentTokenChange}
            style={{
              width: 200,
              borderRadius: "5px",
            }}
            options={[
              {
                value: 1,
                label: (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {" "}
                    <img
                      src="/images/ethereum-eth-logo.png"
                      alt="ethereum"
                      width={20}
                    />{" "}
                    <span style={{ marginLeft: ".5rem" }}> WETH </span>{" "}
                  </div>
                ),
              },
              {
                value: 2,
                label: (
                  <div>
                    {" "}
                    <img
                      src="/images/multi-collateral-dai-dai-logo.png"
                      alt="ethereum"
                      width={20}
                    />{" "}
                    <span style={{ marginLeft: ".5rem" }}> DAI </span>{" "}
                  </div>
                ),
              },
              {
                value: 3,
                label: (
                  <div>
                    {" "}
                    <img
                      src="/images/usd-coin-usdc-logo.png"
                      alt="ethereum"
                      width={20}
                    />{" "}
                    <span style={{ marginLeft: ".5rem" }}> USDC </span>{" "}
                  </div>
                ),
              },
              {
                value: 4,
                label: (
                  <div>
                    {" "}
                    <img
                      src="/images/tether-usdt-logo.png"
                      alt="ethereum"
                      width={20}
                    />{" "}
                    <span style={{ marginLeft: ".5rem" }}> USDT </span>{" "}
                  </div>
                ),
              },
            ]}
          />
        </div>
        <div className={styles.mainFormOptions}>
          <small>Set Daily Rent Price</small>
          <input
            type="text"
            onChange={(e) => handleDailyRentalPrice(Number(e.target.value))}
          />
          {rentError !== null && (
            <span style={{ color: "orangered", fontWeight: "bolder" }}>
              {" "}
              {rentError}{" "}
            </span>
          )}
        </div>

        {/* <div className={styles.mainFormOptions}>
          <small>Set Collateral Price</small>
          <input type="text"  onChange={(e) => handleCollateral(parseFloat(e.target.value))}  />
          {collateralError !== null && <span style={{ color: "orangered", fontWeight: "bolder" }}> {collateralError} </span>}
          </div> */}

        <div className={styles.mainFormOptions}>
          <small>Set Max Rent Duration {`(Days)`}</small>
          <input
            type="number"
            min={1}
            onChange={(e) => handleMaxRentDuration(parseInt(e.target.value))}
          />
          {rentDaysError !== null && (
            <span style={{ color: "orangered", fontWeight: "bolder" }}>
              {" "}
              {rentDaysError}{" "}
            </span>
          )}
        </div>

        <button onClick={() => addCollateralAndLendPrice()}>
          {loadingTxn ? "Processing Lending..." : "Complete Lend"}
        </button>
      </div>
    </Modal>
  );
};

export default LendModal;
