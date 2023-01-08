import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import ArtCard from '../ArtCard/ArtCard';
import styles from './collectioncomp.module.scss'

const featuredData = [
  {
    image: "/images/ART01.png",
    title: "Hadara #1",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART02.png",
    title: "Hadara #2",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART03.png",
    title: "Hadara #3",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART04.png",
    title: "Hadara #4",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART05.png",
    title: "Hadara #5",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART06.png",
    title: "Hadara #6",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART07.png",
    title: "Hadara #7",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART08.png",
    title: "Hadara #8",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART09.png",
    title: "Hadara #9",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART10.png",
    title: "Hadara #10",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART11.png",
    title: "Hadara #11",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART12.png",
    title: "Hadara #12",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART13.png",
    title: "Hadara #13",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART14.png",
    title: "Hadara #14",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART15.png",
    title: "Hadara #15",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART16.png",
    title: "Hadara #16",
    collection: "",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
];

const CollectionItemsComp = () => {

  const collectionDetails = useSelector((state) => state.collectionDetails)


  const { collectionInfo } = collectionDetails


  const { colName, colSymbol } = collectionInfo



  return (
    <div className={styles.mainContainer}>
    <div className={styles.caption}>
      <h1> {colName} {`(${colSymbol})`} </h1>
    </div>
    <div className={styles.mainPart}>
      <h2>COLLECTION ITEMS</h2>
      <div className={styles.artPart}>
        {featuredData.map((item, index) => (
          <div key={index}>
            <ArtCard
              image={item.image}
              title={item.title}
              collectionName={item.collection}
              creatorName={item.creator}
              bidPrice={item.bidPrice}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default CollectionItemsComp