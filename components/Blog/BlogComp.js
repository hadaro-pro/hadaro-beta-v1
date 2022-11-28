import React from 'react'
import styles from './blog.module.scss'

const listData = [
  {
    caption: "INTRO",
    description: "I believe NFT renting will change the way we consume digital assets, especially in the gaming sector. Today I’ll briefly go over NFT renting focused on gaming, the problem with web2 gaming, how NFTs solve the traditional problem & the overall vision of the gaming future.",
  },
  {
    caption: "PROBLEM",
    description: " I’ll frame the problem in a story. I used to play fortnite for fun, my friends owned these extremely valuable fortnite skins that not many other players had, others would kill to even get a day to play with these skins because they are “rare” and if you we’re seen wearing the skin, by default other players are intimidated by you. When i discovered NFTs, this got me thinking…",
  },
  {
    caption: "SOLUTION",
    description: "What if owners can list their skins for rent to other players who can’t afford it & those owners can make a passive income off their assets while playing another game ? NFTs solve this problem, NFTs allow owners to list their assets for others to rent, this makes fortnite skins a source of passive income for owners as opposed to these rare skins just sitting in a collection doing nothing."
  },
  {
    caption: "VISION",
    description: "What if owners can list their skins for rent to other players who can’t afford it & those owners can make a passive income off their assets while playing another game ? NFTs solve this problem, NFTs allow owners to list their assets for others to rent, this makes fortnite skins a source of passive income for owners as opposed to these rare skins just sitting in a collection doing nothing."
  },
  {
    caption: "CONCLUSION",
    description: "What if owners can list their skins for rent to other players who can’t afford it & those owners can make a passive income off their assets while playing another game ? NFTs solve this problem, NFTs allow owners to list their assets for others to rent, this makes fortnite skins a source of passive income for owners as opposed to these rare skins just sitting in a collection doing nothing."
  },
  
];

const BlogComp = () => {
  return (
    <div className={styles.mainContainer}>
    <div className={styles.caption}>
      <h1>BLOG</h1>
    </div>

    <div className={styles.mainPart}>
      <div className={styles.mainPartInner}>
        <div className={styles.innerDescPart}>
        <h2>NFT gamers are the future of currency.</h2>
          {
            listData.map((item, index) => (
              <div key={index} className={styles.innerDescItem} >
                <h4> {item.caption} </h4>
                <p> {item.description} </p>
               </div> 
            ))
          }
          <h3>Mustafa Assaad &#126; co-founder &#38; CEO</h3>
        </div>
        <div className={styles.innerImgPart}>
          <img src="images/lego-bricks.png" alt="info" className={styles.imageUpper} />
          <img    src="/images/businessman.png"  alt="young-people-workers"   className={styles.imageLower} />
        </div>
      </div>
    </div>
  </div>
  )
}

export default BlogComp


