import React from 'react';

import { ICartItem } from '../../../../../models/cart.models';
import DesignSVGPreview from '../../../thanksPageComponents/OrderItems/OrderItem/DesignSVGPreview/DesignSVGPreview';
import styles from './orderSummaryItem.module.scss';

type OrderSummaryItemPropsType = {
  item: ICartItem;
};

const OrderSummaryItem = ({ item }: OrderSummaryItemPropsType) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.img_wrapper}>
        <DesignSVGPreview designId={item.designId} className={styles.product_image} />
      </div>
      <p className={styles.product_title}>{item.description}</p>
    </div>
  );
};

export default OrderSummaryItem;
