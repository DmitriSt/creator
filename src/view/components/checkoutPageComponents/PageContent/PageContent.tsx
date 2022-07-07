import React from 'react';

import CartSummary from '../../cartPageComponents/CartSummary/CartSummary';
import PageTitle from '../../cartPageComponents/PageTitle/PageTitle';
import OrderDetails from '../OrderDetails/OrderDetails';
import OrderSummary from '../OrderSummary/OrderSummary';
import styles from './pageContent.module.scss';

const PageContent = () => {
  return (
    <div className={styles.wrapper}>
      <PageTitle text='Checkout' />
      <section className={styles.section}>
        <OrderDetails />
        <div className={styles.column_right}>
          <OrderSummary />
          <CartSummary />
        </div>
      </section>
    </div>
  );
};

export default PageContent;
