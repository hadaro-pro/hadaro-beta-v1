import React from 'react'
import Link from 'next/link'
import styles from './topsection.module.scss'

const TopSection = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.logoCaptionPart}>
      <Link href="/">
      <img  src='/Hadaro-BETA-logo.png'  alt='hadaro' />
      </Link>
       <div className={styles.logoCaptionLowerPart}>
        <h1>Play, Earn & Compete  <br/> in the biggest NFT tournaments</h1>
        <p>Discover, Lend or rent NFT&#39;s to compete <br/> in gaming tournaments across the <br/> world all in one place.</p>
        <div className={styles.logoCaptionButtons} >
          <button> <Link  href="/marketplace-discover" >  Rent</Link> </button>
          <button> <Link  href="lend-portfolio"> Lend </Link> </button>
        </div>
       </div>
      </div>
      <div className={styles.logoMenuPart}>
       <div className={styles.logoMenuCover}>
        <img src="/landing.png"   alt='home'/>
        <div className={styles.logoMenuMain}>
          <div  className={styles.logoMenuMainItems}>
          <p> <Link  href="/" >Home</Link> </p>
          <p>  <Link href="/about-us" >About Us</Link> </p>
          <p> <Link  href="/marketplace-discover" >  Marketplace </Link></p>
          <p> <Link href="portfolio" >Portfolio</Link> </p>
          <p> <Link  href="lend-portfolio"> Lend </Link></p>
          <p>  <img  src="/images/Search.png"  alt='search'/> </p>
          <p> <button>Wallet Connect</button> </p>
          </div>
        </div>
       </div>
      </div>
    </div>
  )
}

export default TopSection