import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import uniqid from 'uniqid';

import { ProductType } from '../../../../../models/commonPage.models';
import tip from '../../../../assets/images/productGroup/tip.svg';
import styles from './hoverMenu.module.scss';

type HoverMenuPropsType = {
  products: ProductType[];
};

const HoverMenu = ({ products }: HoverMenuPropsType) => {
  const [isVisible, setVisible] = useState(false);

  return (
    <div className={styles.hover}>
      <img
        className={styles.tip}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        src={tip}
        alt='tip'
      />
      {isVisible && (
        <div
          className={styles.menu_wrapper}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
        >
          <div className={styles.menu}>
            {products.map((product) => (
              <div className={styles.product} key={uniqid()}>
                {product.action ? <Link to={`/${product.action}`}>{product.name}</Link> : product.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HoverMenu;
