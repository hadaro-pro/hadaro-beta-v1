import Head from 'next/head'
import Image from 'next/image'
import Footer from '../components/Footer/footer'
import ExploreCollection from '../components/Homepage/ExploreCollection/exploreCollection'
import InfoSection from '../components/Homepage/InfoSection/infoSection'
import TopSection from '../components/Homepage/TopSection/TopSection'
import styles from '../styles/Home.module.scss'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Hadaro BETA</title>
        <meta name="description" content="Hadaro NFT Rental" />
        <link rel="icon" href="/Hadaro-BETA-logo.png" />
      </Head>

  

     <TopSection />
     <ExploreCollection />
     <InfoSection />
     <Footer />
    </div>
  )
}
