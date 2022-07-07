import React from 'react';

import styles from './cartItemsTableHeader.module.scss';

type CartItempropsType = {
  className: string;
  titles: string[];
};

const CartItemsTableHeader = ({ className, titles }: CartItempropsType) => {
  return (
    <div className={`${styles.header} ${className}`}>
      {titles.map((title) => (
        <p key={title}>{title}</p>
      ))}
    </div>
  );
};

export default CartItemsTableHeader;
