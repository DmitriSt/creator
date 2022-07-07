import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { RootStateType } from '../../../stores/store';
import CartItemsTable from '../CartItemsTable/CartItemsTable';
import CartStub from '../CartStub/CartStub';
import CartSummary from '../CartSummary/CartSummary';
import PageTitle from '../PageTitle/PageTitle';
import styles from './pageContent.module.scss';

const PageContent = () => {
  const items = useSelector((state: RootStateType) => state.cartState.cart.lineItems);

  return (
    <div className={styles.wrapper}>
      <PageTitle text='Shopping Cart' />
      {items && items.length ? (
        <>
          <CartItemsTable />
          <div className={styles.section}>
            <Link className={styles.link} to='/'>
              Continue Shopping
            </Link>
            <CartSummary />
          </div>
        </>
      ) : (
        <CartStub />
      )}
    </div>
  );
};

export default PageContent;
