import React from 'react';
import { useSelector } from 'react-redux';

import { RootStateType } from '../../../stores/store';
import CurrencyPicker from './CurrencyPicker/CurrencyPicker';
import styles from './pageTitle.module.scss';

type PageTitlePropsType = {
  text: string;
};

const PageTitle = ({ text }: PageTitlePropsType) => {
  const items = useSelector((state: RootStateType) => state.cartState.cart.lineItems);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title_wrapper}>
        <h1>{text}</h1>
        {items && text === 'Shopping Cart' && items && !!items.length && (
          <div className={styles.counter}>{items.length}</div>
        )}
      </div>
      <CurrencyPicker />
    </div>
  );
};

export default PageTitle;
