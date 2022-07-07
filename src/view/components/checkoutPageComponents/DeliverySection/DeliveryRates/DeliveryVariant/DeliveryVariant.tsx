import React from 'react';

import { DeliveryRateOption } from '../../../../../../models/checkout.models';
import RadioButton from '../../../../sharedComponents/RadioButton/RadioButton';
import styles from './deliveryVariant.module.scss';
import DeliveryVariantInfo from './DeliveryVariantInfo/DeliveryVariantInfo';

type DeliveryVariantPropsType = {
  callback: (dto: DeliveryRateOption) => void;
  checked: boolean;
  provider: string;
  className: string;
  option: DeliveryRateOption;
};

const DeliveryVariant = ({ callback, checked, option, className, provider }: DeliveryVariantPropsType) => {
  const updateDelivery = () => callback(option);

  return (
    <RadioButton className={className} checked={checked} name='delivery' id={option.code} callback={updateDelivery}>
      <DeliveryVariantInfo className={styles.info} option={option} provider={provider} />
    </RadioButton>
  );
};

export default DeliveryVariant;
