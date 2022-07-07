import React from 'react';

import { ITextItem } from '../../../../../models/cart.models';
import styles from './cartSummaryText.module.scss';

type CartSummaryTextPropsType = {
  item: ITextItem;
  className?: string;
};

const CartSummaryText = ({ item, className = '' }: CartSummaryTextPropsType) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <span>{item.valueLeft}</span>
      <span>{item.valueRight}</span>
    </div>
  );
};

export default CartSummaryText;
