import React from 'react';

import { OfferItemType } from '../../../../../models/homePage.models';
// import image from '../../../../assets/images/slider/image1.jpg';
import star from '../../../../assets/images/slider/star.svg';
import Button from '../../../sharedComponents/Button/Button';
import styles from './slide.module.scss';

type SlideProps = {
  offer: OfferItemType;
};

const Slide = (props: SlideProps) => {
  const { offer } = props;

  return (
    <section className={styles.slide} style={{ backgroundImage: `url(${offer.imageUrl})` }}>
      <div className={styles.content}>
        <div className={styles.attention}>
          <img src={star} alt='Best offer' />
          <h3>Our best offer</h3>
        </div>
        <h1>{offer.name}</h1>
        <span className={styles.subtitle}>{offer.description}</span>
        {offer.action ? (
          <Button linkTo={`/${offer.action}`} value={offer.actionText} color='secondary' />
        ) : (
          <Button value={offer.actionText} color='secondary' />
        )}
      </div>
    </section>
  );
};

export default Slide;
