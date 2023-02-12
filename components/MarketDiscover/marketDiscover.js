import React from 'react'
import Link from 'next/link'
import styles from './marketdiscover.module.scss'

const MarketDiscover = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.caption}>
        <h1>MARKETPLACE</h1>
      </div>
     
    <div className={styles.mainContent}>
      <div className={styles.mainCover}>
      <div className={styles.descPart} >
     <h3  className={styles.gradText} >THE PREMIER <br/> MARKETPLACE FOR RARE</h3>
     <p>Discover, Lend or rent NFT&apos;s to compete in gaming tournaments across the world all in one place</p>
     <button> <Link href="/marketplace-featured" > Discover More Treasures  </Link> </button>
      </div>
      <div className={styles.imagePart}>
        <img src="/images/market-discover.png"  alt='marketplace' />
      </div>
    </div>
    </div>
    </div>
  )
}

export default MarketDiscover