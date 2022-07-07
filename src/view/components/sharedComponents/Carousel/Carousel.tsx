import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';

import React from 'react';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import uniqid from 'uniqid';

import { ProductType } from '../../../../models/commonPage.models';
import styles from './carousel.module.scss';
import Slide from './Slide/Slide';

SwiperCore.use([Navigation]);

type CarouselPropsType = {
  products: ProductType[];
};

const Carousel = ({ products }: CarouselPropsType) => (
  <section className={styles.wrapper}>
    <div className={styles.user_picks}>
      <h3 className={styles.title}>User Picks</h3>
      <div className='carousel'>
        <Swiper
          className={styles.elem_wrapper}
          breakpoints={{
            600: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
          navigation={products.length > 4}
          loop={products.length > 4}
        >
          {products.map((product) => (
            <SwiperSlide key={uniqid()}>
              <Slide product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  </section>
);

export default Carousel;
