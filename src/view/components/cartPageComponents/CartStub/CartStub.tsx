import React from 'react';

import emptyCart from '../../../assets/images/empty_cart.svg';
import Button from '../../sharedComponents/Button/Button';
import styles from './cartStub.module.scss';

const CartStub = () => {
  return (
    <div className={styles.wrapper}>
      <img src={emptyCart} alt='' className={styles.image} />
      <p className={styles.title}>Your shopping cart is empty</p>
      <p className={styles.text}>Once you have added items to your shopping cart, you can check out from here.</p>
      <Button linkTo='/' value='View Products' />
    </div>
  );
};

export default CartStub;
