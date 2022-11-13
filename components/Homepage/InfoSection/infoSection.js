import React from 'react'
import InfoGraph from '../../Infographcard/infoGraph'
import styles from "./infoSection.module.scss"

const InfoSection = () => {

  const infoData1 = [
    {
      image: "/images/octagram-1.png",
      caption: "Use your NFT to generate profits",
      desc: "Collect interest from renters, creating a passive income stream.",
    },
    {
      image: "/images/round-triangle-chain.png",
      caption: `Don't have enough time?`,
      desc: `Can't make it to a tournament? Just lend your NFT & gamer generate profits for you`,
    },
    {
      image: "/images/square-illusion.png",
      caption: `Don't have to grind`,
      desc: `Don't feel like competing? Just let other gamers level up your assets for you.`,
    },
    {
      image: "/images/pink-alarm-clock-on-ground.png",
      caption: "Lend in seconds",
      desc: "No middle man. Fast, efficient & clean transactions.",
    },
  ];


  const infoData2 = [
    {
      image: "/images/e-commerce-completed-order.png",
      caption: "Rent to Compete",
      desc: "Avoid paying for expensive NFTs when you can rent for a fraction of the price.",
    },
    {
      image: "/images/pile-of-eight-golden-coins.png",
      caption: `Don't have to own NFT`,
      desc: `Compete to earn rewards & prizes even if your not the owner.`,
    },
    {
      image: "/images/square-illusion.png",
      caption: `Rent as many NFTs as you want`,
      desc: `Don't want to own the NFT? Just rent to use for tournaments & move on.`,
    },
    {
      image: "/images/pink-alarm-clock-on-ground.png",
      caption: "All NFT tournaments in one place",
      desc: "Discover, browse and rent it all in one place",
    },
  ];

  const infoData3 = [
    {
      image: "/images/octagram-1.png",
      caption: "Attract a larger audience",
      desc: "Allow gamers to compete with a lower barrier of entry.",
    },
    {
      image: "/images/round-triangle-chain.png",
      caption: `Increase in sales`,
      desc: `Make NFTs rentable for curious web2 gamers, attracting a broader audience. `,
    },
    {
      image: "/images/pink-play-button.png",
      caption: `Increase in user activity`,
      desc: `Holders can lend to other gamers to compete when they can't make tournaments.`,
    },
    {
      image: "/images/pink-alarm-clock-on-ground.png",
      caption: "Get discovered easier",
      desc: "Discover all NFT tournaments in one place. Creating a network effect in the process.",
    },
  ];



  return (
    <div className={styles.mainContainer}>
      <h1>Why lend or rent NFTs ?</h1>

      <div>
        <InfoGraph heading="Lender" topImage={"/images/info-img01.png"}  dataArray={infoData1}/>
        <InfoGraph heading="Gamer" topImage={"/images/info-img02.png"}  dataArray={infoData2}/>
        <InfoGraph heading="Benefits for NFT gaming tournaments" topImage={"/images/info-img03.png"}  dataArray={infoData3}/>
      </div>
    </div>
  )
}

export default InfoSection