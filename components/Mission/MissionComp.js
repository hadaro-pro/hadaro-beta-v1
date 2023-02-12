import React from "react";
import styles from "./mission.module.scss";

  
// Hadara.io is a lending and rental platform for Web 3.0, NFT, and gaming communities. 

// INTRO

// I believe NFT renting will change the way we consume digital assets, especially in the gaming sector. Today i’ll briefly go over NFT renting focused on gaming, the problem with web2 gaming, how NFTs solve the traditional problem & the overall vision of the gaming future.

// PROBLEM

// I’ll frame the problem in a story. I used to play fortnite for fun, my friends owned these extremely valuable fortnite skins that not many other players had, others would kill to even get a day to play with these skins because they are “rare” and if you we’re seen wearing the skin, by default other players are intimidated by you. When i discovered NFTs, this got me thinking…

// SOLUTION

// What if owners can list their skins for rent to other players who can’t afford it & those owners can make a passive income off their assets while playing another game ? NFTs solve this problem, NFTs allow owners to list their assets for others to rent, this makes fortnite skins a source of passive income for owners as opposed to these rare skins just sitting in a collection doing nothing.

// VISION

// I believe gamers have a huge opportunity to turn the gaming assets that they worked extremely hard for into actual income generating assets. They can play other games while making their NFT characters work for them. This can create a whole new industry of NFT gaming entrepreneurs.

// Conclusion

// The traditional gaming industry does not allow gamers to use the assets they put hours into in a way that serves them financially. NFTs give them the opportunity to turn their NFT gaming assets into passive income while playing other games & allowing renters to rent their assets for a fraction of the price. I’ll be writing more about this topic in detail soon. Let me know your initial thoughts, do you think NFTs can change the way gamers game ?

// What we do

// We are an NFT rental marketplace focused on play to earn gamers. We allow NFT gamers to list their gaming NFTs on our marketplace for other gamers to rent for a fraction of the price, use and give back after the duration period ends.


// Our mission

// We aim to build the largest NFT rental marketplace, you can lend & rent game assets, virtual land, virtual fashion, phygital event tickets, eNFTs, music, physical real estate & subscriptions. Eliminating the traditional middle man in the rental industry through self executing smart contracts, making transactions fast, sufficient & effective for all parties involved.


const listData = [
  {
    caption: "HADARO.IO",
    description: "",
  },
  {
    caption: "What we do",
    description: "We are an NFT rental marketplace focused on play to earn gamers. We allow NFT gamers to list their gaming NFTs on our marketplace for other gamers to rent for a fraction of the price, use and give back after the duration period ends.",
  },
  {
    caption: "Our mission",
    description: "We aim to build the largest NFT rental marketplace, you can lend & rent game assets, virtual land, virtual fashion, phygital event tickets, eNFTs, music, physical real estate & subscriptions. Eliminating the traditional middle man in the rental industry through self executing smart contracts, making transactions fast, sufficient & effective for all parties involved."
  },
  
];

const MissionComp = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.caption}>
        <h1>MISSION</h1>
      </div>

      <div className={styles.mainPart}>
        <div className={styles.mainPartInner}>
          <div className={styles.innerDescPart}>
            {
              listData.map((item, index) => (
                <div key={index} className={styles.innerDescItem} >
                  <h4> {item.caption} </h4>
                  <p> {item.description} </p>
                 </div> 
              ))
            }
          </div>
          <div className={styles.innerImgPart}>
            <img src="images/info.png" alt="info" className={styles.imageUpper} />
            <img    src="/images/young-people-in-the-worker-jumpsuits-with-gadgets.png"  alt="young-people-workers"   className={styles.imageLower} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionComp;
