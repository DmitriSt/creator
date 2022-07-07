import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { RootStateType } from '../../../stores/store';
import CartItem from './CartItem/CartItem';
import CartItemImagePreview from './CartItemImagePreview/CartItemImagePreview';
import styles from './cartItemsTable.module.scss';
import CartItemsTableHeader from './CartItemsTableHeader/CartItemsTableHeader';

const titles = ['PRODUCT', 'OPTIONS', 'QTY', 'PRICE', 'SUBTOTAL', 'EDIT / DELETE'];

const CartItemsTable = () => {
  const items = useSelector((state: RootStateType) => state.cartState.cart.lineItems);
  const [activeProductImage, setActiveProductImage] = useState('');

  const openPreview = useCallback((imageSrc: string) => setActiveProductImage(imageSrc), []);

  const closePreview = useCallback(() => setActiveProductImage(null), []);

  return (
    <div className={styles.table}>
      {items && !!items.length && (
        <>
          <CartItemsTableHeader titles={titles} className={styles.row} />
          {items.map((item) => (
            <CartItem togglePreview={openPreview} className={styles.row} product={item} key={item.itemId} />
          ))}
        </>
      )}
      <CartItemImagePreview close={closePreview} imageSrc={activeProductImage} />
    </div>
  );
};

export default CartItemsTable;
