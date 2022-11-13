import React from 'react'
import Slider from 'react-slick'
import styles from './imageslider.module.scss'

const ImageSlider = () => {

  const sliderData = [
    {
      avatar: "/images/avatarcol-1.png",
      title: "Music",
    },
    {
      avatar: "/images/avatarcol-2.png",
      title: "Domain Names",
    },
    {
      avatar: "/images/avatarcol-3.png",
      title: "Art",
    },
    {
      avatar: "/images/avatarcol-4.png",
      title: "Virtual World",
    }, 
    {
      avatar: "/images/avatarcol-2.png",
      title: "Domain Names",
    },
  ];

  let settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    cssEase: "linear",
    // adaptiveHeight: true,
    initialSlide: 0,
  }


  return (
   <Slider  className={styles.mainOne} {...settings}>
      {
        sliderData.map(({ avatar, title }, index) => (
          <div className={styles.cardWrapper} key={index}>
          <div className={styles.card}>
          <h4> {title} </h4>
          <img src={avatar} alt={title} />
          </div>
          </div>
        ))
      }
   </Slider>
  )
}

export default ImageSlider