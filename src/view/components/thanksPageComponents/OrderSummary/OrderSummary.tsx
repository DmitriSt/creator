import React from 'react';
import { useSelector } from 'react-redux';

import { getOrderSummaryInfo } from '../../../stores/cartStore/cartSelectors';
import CartSummaryText from '../../cartPageComponents/CartSummary/CartSummaryText/CartSummaryText';
import styles from './orderSummary.module.scss';

const OrderSummary = () => {
  const summary = useSelector(getOrderSummaryInfo);

  return (
    <div className={styles.wrapper}>
      {summary.map((item) => {
        return <CartSummaryText key={item.valueLeft} className={styles.item} item={item} />;
      })}
    </div>
  );
};

export default OrderSummary;
