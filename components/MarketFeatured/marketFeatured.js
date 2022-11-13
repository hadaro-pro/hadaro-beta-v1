import React from "react";
import Link from "next/link";
import ArtCard from "../ArtCard/ArtCard";
import styles from "./marketfeatured.module.scss";

const featuredData = [
  {
    image: "/images/ART01.png",
    title: "Paul Bowl",
    collection: "Methapors",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART02.png",
    title: "Snakes",
    collection: "Art#12039",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART03.png",
    title: "Demon",
    collection: "Illustation",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART04.png",
    title: "King George",
    collection: "Constantine",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART05.png",
    title: "Tyler Spanglers",
    collection: "Collage",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART06.png",
    title: "Mickey",
    collection: "Ahonetwo",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART07.png",
    title: "Tumblr",
    collection: "Illustration",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
  {
    image: "/images/ART08.png",
    title: "Hamlet",
    collection: "Contemplates",
    creator: "SalvadorDali",
    bidPrice: 4.98 + " " + "ETH",
  },
];

const MarketFeatured = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.caption}>
        <h1>MARKETPLACE</h1>
      </div>
      <div className={styles.mainPart}>
        <h2>FEATURED ARTWORKS</h2>
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
        <button> <Link href="/marketplace-featured-all"> View More </Link> </button>
      </div>
    </div>
  );
};

export default MarketFeatured;
