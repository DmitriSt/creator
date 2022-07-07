import React from 'react';
import { useSelector } from 'react-redux';

import { ICartItem } from '../../../../../models/cart.models';
import { getPrecisionPrice, getRoundedPrice } from '../../../../helpers/cartHelpers';
import { cartCurrencySign } from '../../../../stores/cartStore/cartSelectors';
import DesignSVGPreview from './DesignSVGPreview/DesignSVGPreview';
import styles from './orderItem.module.scss';

type OrderItemPropsType = {
  className: string;
  item: ICartItem;
};

const OrderItem = ({ className, item }: OrderItemPropsType) => {
  const currency = useSelector(cartCurrencySign);
  const price = getPrecisionPrice(item.price / item.quantity, currency);
  const subTotal = getRoundedPrice(item.price, currency);
  const otherOptions = item.options.filter((el) => el.text !== 'Quantity');

  return (
    <div className={`${styles.item} ${className}`}>
      <DesignSVGPreview designId={item.designId} className={styles.img_wrapper} />
      <div>
        {
          // <p className={styles.product_title}>Product Title</p>
        }
        <p className={styles.product_title}>{item.description}</p>
        {otherOptions.map((option) => {
          const selected = option.items.find((el) => el.value === option.selectedValue);
          if (selected) {
            const text = `${option.text}:`;
            return (
              <div key={option.text} className={styles.options}>
                <span className={styles.option}>{text}</span>
                <span>{selected.text}</span>
              </div>
            );
          }
          return null;
        })}
      </div>
      <p className={styles.quantity}>{item.quantity}</p>
      <p className={styles.price}>{price}</p>
      <p className={styles.subtotal}>{subTotal}</p>
    </div>
  );
};

export default OrderItem;
