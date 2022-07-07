import 'swiper/swiper.scss';
import './zoom.scss';

import React, { useEffect } from 'react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import close from '../../../../../../../assets/images/productPage/close.svg';
import styles from './zoomedSlider.module.scss';

SwiperCore.use([Navigation, Pagination]);

type ZoomedSliderPropsType = {
  images: string[];
  handleClose: () => void;
};

const ZoomedSlider = ({ images, handleClose }: ZoomedSliderPropsType) => {
  const handleCloseEsc = (e: KeyboardEvent) => {
    if (e.code === 'Escape') handleClose();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleCloseEsc, false);
    return () => {
      document.removeEventListener('keydown', handleCloseEsc, false);
    };
  }, []);

  const slides = [];
  for (let i = 0; i < images.length; i += 1) {
    slides.push(
      <SwiperSlide key={`slide-${i}`} className={styles.slide} tag='li'>
        <img src={images[i]} alt={`Slide ${i}`} />
      </SwiperSlide>
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.close} onClick={handleClose}>
        <img src={close} alt='close' />
      </div>
      <div className={styles.zoom}>
        <Swiper
          className={styles.slider_wrap}
          spaceBetween={20}
          navigation
          pagination={{
            clickable: true,
            type: 'fraction',
          }}
          slidesPerView={1}
        >
          {slides}
        </Swiper>
      </div>
    </div>
  );
};
export default ZoomedSlider;
