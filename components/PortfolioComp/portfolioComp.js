import React, {useState} from 'react'
import styles from './portfoliocomp.module.scss'

const PortfolioComp = () => {

  const [openLend, setOpenLend] = useState(false)
  const [openRent, setOpenRent] = useState(false)
  const [openWallet, setOpenWallet] = useState(false)


  return (
    <div className={styles.mainContainer}>
      <div className={styles.caption} >
        <h1>PORTFOLIO</h1>
      </div>

      <div className={styles.mainComp} >
        <div  className={styles.mainCompInner} >
          <div className={styles.imgPart}>
            <img  src="/images/port-img.png"  alt='img'  />
          </div>
          <div className={styles.lowerPart}>
          <div  className={styles.menuItem }>
            <div className={styles.menuItemTop}>
          <img src={`${openLend ? '/images/minus.png' : '/images/cross.png' }`} alt=""  onClick={() => { setOpenLend((prev) => !prev) }} />
          <p>Lending</p>
          </div>
          <div  className={openLend ? styles.dropdownmenu : styles.dropdownmenuinactive}>
            <div  className={styles.subdropmenu}>
            <small>This shows the NFTS that are being lent</small>
            </div>
          </div>
          </div>

          <div  className={styles.menuItem }>
            <div className={styles.menuItemTop}>
          <img  src={`${openRent ? '/images/minus.png' : '/images/cross.png' }`}  alt=""  onClick={() => { setOpenRent((prev) => !prev) }} />
          <p>Renting</p>
          </div>
          <div  className={openRent ? styles.dropdownmenu : styles.dropdownmenuinactive}>
            <div  className={styles.subdropmenu}>
            <small>This shows the NFTS that are being rented</small>
            </div>
          </div>
          </div>

          <div  className={styles.menuItem }>
            <div className={styles.menuItemTop}>
          <img  src={`${openWallet ? '/images/minus.png' : '/images/cross.png' }`}  alt=""  onClick={() => { setOpenWallet((prev) => !prev) }} />
          <p>My Wallet</p>
          </div>
          <div  className={openWallet ? styles.dropdownmenu : styles.dropdownmenuinactive}>
            <div  className={styles.subdropmenu}>
            <small>This shows the NFTS in the Wallet</small>
            </div>
          </div>
          </div>
        
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioComp