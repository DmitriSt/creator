import React from 'react';
import { useSelector } from 'react-redux';

import { getCartSummaryInfo } from '../../../stores/cartStore/cartSelectors';
import PromocodeBlock from '../PromocodeBlock/PromocodeBlock';
import styles from './cartSummary.module.scss';
import CartSummaryButton from './CartSummaryButton/CartSummaryButton';
import CartSummaryText from './CartSummaryText/CartSummaryText';

const CartSummary = () => {
  const items = useSelector(getCartSummaryInfo);

  return (
    <div className={styles.wrapper}>
      <PromocodeBlock />
      <div className={styles.items}>
        {items.map((item) => {
          return <CartSummaryText key={item.valueLeft} className={styles.item} item={item} />;
        })}
      </div>
      <CartSummaryButton />
    </div>
  );
};

export default CartSummary;
