import React, {useState} from 'react'
import { Radio, Select } from 'antd';
import styles from './togglenetwork.module.scss'

const ToogleNetwork = ({ setChain, handleGetNFTs, lendItemObject, setLendItemObject  }) => {

  // console.log(lendItemObject)

  const [size, setSize] = useState('middle');

  const handleChange = (value) => {
    setChain(value)
    setLendItemObject({ ...lendItemObject, chain: value })
    // window.alert(`Selected: ${value}`);
  };

  return (
    <div className={styles.mainCover}>
       <h5>Select Network</h5>
     <div  className={styles.selectNetworkCover}>
      
     
      <Select
        size={size}
        defaultValue="0x1"
        onChange={handleChange}
        style={{
          width: 200,
          borderRadius: "5px"
        }}
        options={[
          {
            value: '0x1',
            label: <div style={{ display: "flex", alignItems: "center" }} > <img src="/images/ethereum-eth-logo.png"  alt='ethereum'  width={20} />  <span style={{marginLeft: ".5rem"}}> Ethereum </span> </div>,
          },
          {
            value: '0x89',
            label: <div> <img src="/images/polygon-matic-logo.png"  alt='ethereum'  width={20} />  <span style={{marginLeft: ".5rem"}}> Polyon </span> </div>,
          },
          {
            value: '0x5',
            label: <div> <img src="/images/ethereum-eth-logo.png"  alt='ethereum'  width={20} />  <span style={{marginLeft: ".5rem"}}> Goerli </span> </div>,
          }
        ]} 
      />
      <div> <button onClick={() => handleGetNFTs()} >Fetch My NFTs</button> </div>
      
      </div>   
    </div>
  )
}

export default ToogleNetwork