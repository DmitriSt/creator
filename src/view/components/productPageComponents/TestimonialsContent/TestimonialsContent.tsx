import React from 'react';
import { useSelector } from 'react-redux';
import uniqid from 'uniqid';

import { defaultProductPageSettings } from '../../../../models/productPage.models';
import { RootStateType } from '../../../stores/store';
import Quote from '../../sharedComponents/Quote/Quote';
import styles from './testimonialsContent.module.scss';

const TestimonialsContent = () => {
  const testimonials = useSelector((state: RootStateType) => state.appState.testimonials);

  return (
    <section className={styles.testimonials}>
      <span className={`${styles.title} section_title`}>Our clients say</span>
      <div className={styles.grid}>
        {testimonials?.slice(0, defaultProductPageSettings.testimonials.count).map((quote) => (
          <Quote key={uniqid()} statement={quote} />
        ))}
      </div>
    </section>
  );
};
export default TestimonialsContent;
