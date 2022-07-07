import React from 'react';
import { useSelector } from 'react-redux';

import cart from '../../../assets/images/whiteCart.svg';
import { RootStateType } from '../../../stores/store';
import Calculator from '../../productPageComponents/ProductSection/ProductSidebar/Calculator/Calculator';
import Button from '../../sharedComponents/Button/Button';
import styles from './productProperties.module.scss';

const ProductProperties = () => {
  const { filters, id, price } = useSelector((state: RootStateType) => state.artworkState.activeProduct);

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>PRODUCT PROPERTIES</p>
      <Calculator filters={filters} isCalculator priceText='Your Price' productId={id} initialPrice={price || 0} />
      <Button className={styles.button} image={cart} value='Add to Cart' />
      <p className={styles.warning}>Upload Artwork to proceed</p>
    </div>
  );
};

export default ProductProperties;
