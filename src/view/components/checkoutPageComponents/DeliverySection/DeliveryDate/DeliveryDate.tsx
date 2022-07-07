import React from 'react';

import styles from './deliveryDate.module.scss';

type DeliveryDatePropsType = {
  deliveryDate: string;
  className?: string;
};

const DeliveryDate = ({ deliveryDate, className }: DeliveryDatePropsType) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <span className={styles.label}>{deliveryDate}</span>
    </div>
  );
};

export default DeliveryDate;
