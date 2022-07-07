import React from 'react';

import { TestimonialType } from '../../../../models/productPage.models';
// import author from '../../../assets/images/footer/person.png';
import styles from './quote.module.scss';

type QuotePropsType = {
  statement: TestimonialType;
  showMark?: boolean;
};

const Quote = ({ statement, showMark = false }: QuotePropsType) => {
  const authorText = `${statement.author}, ${statement.jobTitle}, ${statement.city}`;
  return (
    <div className={styles.citation}>
      <p className={styles.text}>{statement.text}</p>
      <div className={showMark ? styles.author_quote : styles.author}>
        <img className={styles.avatar} src={statement.pictureUrl} alt={statement.author} />
        <span className={styles.name}>{authorText}</span>
      </div>
    </div>
  );
};

export default Quote;
