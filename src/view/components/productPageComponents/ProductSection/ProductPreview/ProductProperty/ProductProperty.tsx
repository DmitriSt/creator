import React, { useState } from 'react';

import ProductFeatureIconMap from '../../../../../../models/constants/product';
import { FeatureType } from '../../../../../../models/productPage.models';
import styles from './productProperty.module.scss';

type ProductPropertyPropsType = {
  feature: FeatureType;
};

const ProductProperty = ({ feature }: ProductPropertyPropsType) => {
  const [isVisible, setVisible] = useState(false);
  const text = feature.text.trim().toLowerCase().split(' ').join('_');

  const icon = ProductFeatureIconMap[text];

  return (
    <div className={styles.feature}>
      <img src={icon} alt={feature.text} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)} />
      {isVisible && feature.text && (
        <div
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          className={styles.hover_wrapper}
        >
          <div className={styles.hover}>
            <p className={styles.description}>{feature.text}</p>
          </div>
        </div>
      )}
      <span className={styles.text}>{feature.description}</span>
    </div>
  );
};

export default ProductProperty;
