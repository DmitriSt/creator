import React from 'react';
import { useSelector } from 'react-redux';
import uniqid from 'uniqid';

import { RootStateType } from '../../../../stores/store';
import styles from './productPreview.module.scss';
import ProductProperty from './ProductProperty/ProductProperty';
import ProductSlider from './ProductSlider/ProductSlider';

const ProductPreview = () => {
  const product = useSelector((state: RootStateType) => state.productPageState.details);

  return (
    <section className={styles.wrapper}>
      <div className={styles.product}>
        <h1 className={styles.title}>{product?.name}</h1>
        <div className={styles.preview}>
          <div className={styles.slider}>
            <ProductSlider />
          </div>
          <div className={styles.properties}>
            {product?.features.map((feature) => {
              return <ProductProperty key={uniqid()} feature={feature} />;
            })}
          </div>
        </div>
        <p className={styles.subtext}>{product.description}</p>
      </div>
    </section>
  );
};

export default ProductPreview;
