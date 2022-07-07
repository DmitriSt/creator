import 'swiper/swiper-bundle.css';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SwiperCore, { Controller, Navigation, Pagination, Thumbs, Zoom } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperClass from 'swiper/types/swiper-class';

import { RootStateType } from '../../../../../stores/store';
// import image from '../../../../../assets/images/productPage/cards.png';
import styles from './productSlider.module.scss';
import ZoomComponent from './Zoom/Zoom';

SwiperCore.use([Navigation, Pagination, Controller, Thumbs, Zoom]);

const Slider = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | undefined>();
  const images = useSelector((state: RootStateType) => state.productPageState.details?.images);
  const zoomedImages = images?.map((item) => item.large);

  const slides = [];
  const thumbs = [];
  if (images && images.length) {
    for (let i = 0; i < images.length; i += 1) {
      slides.push(
        <SwiperSlide key={`slide-${i}`} tag='li'>
          <img className={styles.images} src={images[i].medium} alt={`Slide ${i}`} />
        </SwiperSlide>
      );
      thumbs.push(
        <SwiperSlide className={styles.slide} key={`thumb-${i}`} tag='li'>
          <img className={styles.images} src={images[i].small} alt={`Thumbnail ${i}`} />
        </SwiperSlide>
      );
    }
  }

  return (
    <div className={styles.thumbs_container}>
      {zoomedImages && <ZoomComponent images={zoomedImages} />}
      <Swiper
        className={styles.current_slide}
        id='main'
        thumbs={{
          swiper: thumbsSwiper,
          slideThumbActiveClass: styles.active,
        }}
        tag='section'
        wrapperTag='ul'
        spaceBetween={10}
        slidesPerView={1}
        loop
      >
        {slides}
      </Swiper>

      <Swiper
        className={styles.other_slider_container}
        id='thumbs'
        spaceBetween={5}
        slidesPerView={5}
        slideActiveClass={styles.active}
        onSwiper={setThumbsSwiper}
      >
        {thumbs}
      </Swiper>
    </div>
  );
};

export default Slider;
