import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';

import React from 'react';
import { useSelector } from 'react-redux';
import SwiperCore, { Autoplay, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import uniqid from 'uniqid';

import { defaultHomePageSettings } from '../../../../models/homePage.models';
import { RootStateType } from '../../../stores/store';
import Slide from './Slide/Slide';
import styles from './slider.module.scss';

SwiperCore.use([Autoplay, Pagination]);

const Slider = () => {
  const bestOffers = useSelector((state: RootStateType) => state.homePageState.bestOffers);
  const defaultDisplayTime = defaultHomePageSettings.offers.displayTime;

  return (
    <section className={styles.wrapper}>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletClass: styles.bullet,
          bulletActiveClass: styles.bullet_active,
        }}
        autoplay={{
          delay: (bestOffers.displayDuration ? bestOffers.displayDuration : defaultDisplayTime) * 1000,
          disableOnInteraction: false,
        }}
        loop
      >
        {bestOffers?.slides.map((offer) => (
          <SwiperSlide className={styles.slide} key={uniqid()}>
            <Slide offer={offer} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Slider;
