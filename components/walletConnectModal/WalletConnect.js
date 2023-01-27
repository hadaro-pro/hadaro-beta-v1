import React, { useState, useEffect } from "react";
import { useConnect, useAccount , useNetwork} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Modal, message } from "antd";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import styles from "./walletconnect.module.scss";

const connectorImages = [
  {
    image: "/images/metamask.png",
    title: 'metamask'
  },
  {
    image: "/images/wallet-connect.png",
    title: 'wallet-connect'
  },
  {
    image: "/images/coinbase.png",
    title: 'coinbase'
  },
];

const WalletConnect = ({ modalOpen, cancelModal}) => {

 




  const { isConnected, address } = useAccount();

  const { chain } = useNetwork()

  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

    const showError = ()=> {
      return message.error(error.message)
    }

  async function HandleAuth() {
    try {
      if (isConnected) {
        message.info(`${address} signed in`);
      } else {
        const { account, chain } = await connectAsync({
          connector: new InjectedConnector(),
        });

        const userData = { address: account, chain: chain.id, network: "evm" };

        // console.log(userData);
      }
    } catch (err) {
      // console.log(err);
    }
  }

  return (
    <Modal
      open={modalOpen}
      footer={null}
      onCancel={cancelModal}
      className={styles.mainContainer}
    >
      <div className={styles.closeMenu}>
        <CloseOutlined  className={styles.closeIcon} onClick={cancelModal} />
      </div>
      <div className={styles.modalContent}>
        <h4>Connect Your Wallet</h4>

        <div>
          {connectors.map((connector, index) => {
            const connectorImage = connectorImages[index].image;
            const connectorCaption = connectorImages[index].title
            return (
              <div className={styles.connectOptions}  key={connector.id}>
                <img src={connectorImage} alt={connectorCaption} />
                <span onClick={() => connect({ connector })}> {connector.name} </span> 
                 <span  className={styles.unsupported}> {!connector.ready && ' (unsupported)' }  </span>  <span  className={styles.loadingPart}> { isLoading &&
                connector.id === pendingConnector?.id &&
                <LoadingOutlined  style={{ fontSize: "2rem" , color: "#fff", margin: "auto"}} /> }  </span>
              </div>
            );
          })}

          {error && <div  className={styles.errorPart}>
              <p> Error :- {error.message === 'Connector already connected' ? 'Wallet already connected' : error.message}</p>
             </div> }
        </div>
      </div>
    </Modal>
  );
};

export default WalletConnect;
