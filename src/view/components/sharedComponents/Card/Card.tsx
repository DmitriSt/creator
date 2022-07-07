import React from 'react';
import { Link } from 'react-router-dom';

import { ProductType, ProductTypes } from '../../../../models/commonPage.models';
import styles from './card.module.scss';
import HoverMenu from './HoverMenu/HoverMenu';

export type CardGroupType = {
  products: ProductType[];
};

type CardPropsType = {
  product: ProductType;
};

const Card = ({ product }: CardPropsType) => {
  const isGroup = product.productType === ProductTypes.Group;

  const getProductsNumber = () => {
    if (isGroup && product.products) {
      if (product.products.length > 1) {
        return `${product.products.length} products`;
      }
      if (product.products.length === 1) {
        return `${product.products.length} product`;
      }
    }
    return 'No products';
  };

  const content = (
    <div className={styles.card}>
      <img src={product.image.small} className={styles.image} alt={product.name} />
      <div className={styles.content}>
        <span className={styles.title}>{product.name}</span>
        <p className={styles.description}>{product.description}</p>
        {isGroup && product.products && (
          <div className={styles.group}>
            {getProductsNumber()}
            <HoverMenu products={product.products} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.wrapper}>{product.action ? <Link to={`/${product.action}`}>{content}</Link> : content}</div>
  );
};

export default Card;
