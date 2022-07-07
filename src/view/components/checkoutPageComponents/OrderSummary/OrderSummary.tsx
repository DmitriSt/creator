import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import arrow from '../../../assets/images/arrowRight.svg';
import { ReactComponent as EditIcon } from '../../../assets/images/designer/brush.svg';
import { RootStateType } from '../../../stores/store';
import Button from '../../sharedComponents/Button/Button';
import styles from './orderSummary.module.scss';
import OrderSummaryItem from './OrderSummaryItem/OrderSummaryItem';

const OrderSummary = () => {
  const [isFullList, setIsFullList] = useState(false);
  const cartItems = useSelector((state: RootStateType) => state.cartState.cart.lineItems);
  const list = isFullList ? cartItems : cartItems && cartItems.slice(0, 2);
  const text = `+${cartItems?.length - 2 || ''} more`;

  const toggleList = () => {
    setIsFullList(!isFullList);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <span>ORDER SUMMARY</span>
        <Link to='/cart'>
          <EditIcon className={styles.icon} />
        </Link>
      </div>
      {list && list.map((item) => <OrderSummaryItem key={item.itemId} item={item} />)}
      {cartItems && cartItems.length > 2 && (
        <Button
          onClick={toggleList}
          variant='outlined'
          className={styles.footer}
          image={isFullList ? '' : arrow}
          value={isFullList ? 'Hide' : text}
        />
      )}
    </div>
  );
};

export default OrderSummary;
