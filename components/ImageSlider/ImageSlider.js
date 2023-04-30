import React, { useState } from "react";
import { Carousel } from "antd";
// import Slider from 'react-slick'
import styles from "./imageslider.module.scss";
import Link from "next/link";

const ImageSlider = () => {
  const [itemAnimation, setItemAnimation] = useState(false);
  const [closeCaption, setCloseCaption] = useState(false);
  const carouselData = [
    // {
    //   caption: "$50,000 dollars worth of prizes!",
    //   description: "Compete your way to the top 10.",
    //   link: "/marketplace-discover",
    //   backgroundColor: "rgb(155 81 224)",
    // },
    // {
    //   caption: "10 tournaments taking place this week!",
    //   description: "Rent to compete now.",
    //   link: "/marketplace-discover",
    //   backgroundColor: " rgb(43, 171, 86)",
    // },
    {
      caption: "Level Up your NFTs by lending",
      description: "Lend your NFTs for other gamers to compete for you.",
      link: "/lend-portfolio",
      backgroundColor: "rgb(207, 38, 38)",
    },
  ];

  // const sliderData = [
  //   {
  //     avatar: "/images/avatarcol-1.png",
  //     title: "Music",
  //   },
  //   {
  //     avatar: "/images/avatarcol-2.png",
  //     title: "Domain Names",
  //   },
  //   {
  //     avatar: "/images/avatarcol-3.png",
  //     title: "Art",
  //   },
  //   {
  //     avatar: "/images/avatarcol-4.png",
  //     title: "Virtual World",
  //   },
  //   {
  //     avatar: "/images/avatarcol-2.png",
  //     title: "Domain Names",
  //   },
  // ];

  // let settings = {
  //   dots: false,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 4,
  //   slidesToScroll: 1,
  //   cssEase: "linear",
  //   // adaptiveHeight: true,
  //   initialSlide: 0,
  // }

  return (
    <Carousel
     autoplay
     autoplaySpeed={2500} 
      afterChange={() => {
        setItemAnimation(true);
      }}
      beforeChange={() => {
        setItemAnimation(false);
        setCloseCaption(true);
      }}
    >
      {carouselData.map((item, index) => (
        <div key={index} className={styles.container}>
          <div
            className={styles.itemContainer}
            key={index}
            style={{ backgroundColor: item.backgroundColor }}
          >
            {itemAnimation ? (
              <div className={[styles.itemAnimate].join(" ")}>
                <h1> {item.caption} </h1>
                <p> {item.description} </p>
                <Link href={item.link}>
                  {" "}
                  <button> Click Here </button>
                </Link>
              </div>
            ) : closeCaption ? (
              " "
            ) : (
              <div
                className={[
                  itemAnimation ? styles.displayNone : styles.itemInner,
                ].join(" ")}
              >
                <h1> {item.caption} </h1>
                <p> {item.description} </p>
                <Link href={item.link}>
                  {" "}
                  <button> Click Here </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </Carousel>

    //  <Slider  className={styles.mainOne} {...settings}>
    //     {
    //       sliderData.map(({ avatar, title }, index) => (
    //         <div className={styles.cardWrapper} key={index}>
    //         <div className={styles.card}>
    //         <h4> {title} </h4>
    //         <img src={avatar} alt={title} />
    //         </div>
    //         </div>
    //       ))
    //     }
    //  </Slider>
  );
};

export default ImageSlider;
