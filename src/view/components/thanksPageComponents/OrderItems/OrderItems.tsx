import React from 'react';
import { useSelector } from 'react-redux';

import { RootStateType } from '../../../stores/store';
import CartItemsTableHeader from '../../cartPageComponents/CartItemsTable/CartItemsTableHeader/CartItemsTableHeader';
import OrderItem from './OrderItem/OrderItem';
import styles from './orderItems.module.scss';

const OrderItems = () => {
  const items = useSelector((state: RootStateType) => state.cartState.cart.lineItems);
  const titles = ['PRODUCT', 'OPTIONS', 'QTY', 'PRICE', 'SUBTOTAL'];

  return (
    <div className={styles.table}>
      {items && !!items.length && (
        <>
          <CartItemsTableHeader titles={titles} className={styles.row} />
          {items.map((item) => (
            <OrderItem className={styles.row} item={item} key={item.itemId} />
          ))}
        </>
      )}
    </div>
  );
};

export default OrderItems;
