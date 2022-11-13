import React from "react";
import styles from "./explorecollection.module.scss";
import Slider from 'react-slick'
import ImageSlider from "../../ImageSlider/ImageSlider";

// import { Navigation } from "swiper";

// import { Swiper, SwiperSlide } from "swiper/react";

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
//     avatar: "/images/avatarcol-1.png",
//     title: "Music",
//   },
//   ,
//   {
//     avatar: "/images/avatarcol-3.png",
//     title: "Art",
//   }
// ];

const ExploreCollection = () => {
  return (
    <div className={styles.mainContainer}>
      <h1> Explore collection </h1>
      
        <ImageSlider />

        {/* <Swiper
          modules={[Navigation]}
          spaceBetween={15}
          slidesPerView={4}
          navigation={true}
          // pagination={{ clickable: true }}
          className={styles.collectionContainer}
        >
          {sliderData.map(({avatar, title}, index) => (
            <SwiperSlide key={index} className={styles.cardMain} >
              <div >
              <h5>{title}</h5>
                <img src={avatar} alt={title} />
              </div>
            </SwiperSlide>
          ))} 
        </Swiper> */}
      </div>
  );
};

export default ExploreCollection;
