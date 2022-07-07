import React from 'react';
import { Link } from 'react-router-dom';

import { ProductType } from '../../../../../models/commonPage.models';
import styles from './slide.module.scss';

type SlideProps = {
  product: ProductType;
};

const Slide = ({ product }: SlideProps) => (
  <div className={styles.slide}>
    {product.action ? (
      <Link to={`/${product.action}`}>
        <div className={styles.image} style={{ backgroundImage: `url('${product.image.small}')` }} />
        <h3>{product.name}</h3>
      </Link>
    ) : (
      <>
        <div className={styles.image} style={{ backgroundImage: `url('${product.image.small}')` }} />
        <h3>{product.name}</h3>
      </>
    )}
  </div>
);

export default Slide;
