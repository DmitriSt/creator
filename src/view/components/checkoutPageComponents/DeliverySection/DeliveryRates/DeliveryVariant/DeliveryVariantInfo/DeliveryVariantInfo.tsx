import React from 'react';
import { useSelector } from 'react-redux';

import { DeliveryRateOption } from '../../../../../../../models/checkout.models';
import { getPrecisionPrice } from '../../../../../../helpers/cartHelpers';
import { cartCurrencySign } from '../../../../../../stores/cartStore/cartSelectors';
import styles from './deliveryVariantInfo.module.scss';

type DeliveryVariantInfoPropsType = {
  option: DeliveryRateOption;
  provider: string;
  className?: string;
};

const DeliveryVariantInfo = ({ option, provider, className }: DeliveryVariantInfoPropsType) => {
  const deliveryName = `${provider} ${option.name}`;
  const currency = useSelector(cartCurrencySign);
  const price = getPrecisionPrice(option.ratePrice, currency);
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.delivery_block}>
        <span className={styles.delivery}>{deliveryName}</span>
        <span className={styles.price}>{price}</span>
      </div>
      {!!option.comment && <p className={styles.description}>{option.comment}</p>}
    </div>
  );
};

export default DeliveryVariantInfo;
