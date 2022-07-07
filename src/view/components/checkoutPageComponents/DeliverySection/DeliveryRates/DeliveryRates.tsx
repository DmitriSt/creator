import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DeliveryRateOption } from '../../../../../models/checkout.models';
import { updateDeliveryInfo } from '../../../../stores/checkoutStore/user/userActions';
import { RootStateType } from '../../../../stores/store';
// import DeliveryDate from '../DeliveryDate/DeliveryDate';
import styles from './deliveryRates.module.scss';
import DeliveryVariant from './DeliveryVariant/DeliveryVariant';

const DeliveryRates = () => {
  const dispatch = useDispatch();
  const deliverySetup = useSelector((state: RootStateType) => state.checkoutState.checkout.deliveryRates);
  const delivery = useSelector((state: RootStateType) => state.checkoutState.user.delivery.delivery);

  const toggleDelivery = useCallback((dto: DeliveryRateOption) => {
    dispatch(updateDeliveryInfo({ delivery: dto, isReady: false }));
  }, []);

  return (
    <div className={styles.content}>
      {deliverySetup.options.map((option, index) => {
        return (
          <DeliveryVariant
            key={option.code}
            option={option}
            provider={deliverySetup.provider}
            checked={delivery ? option.code === delivery.code : index === 0}
            className={styles.variant}
            callback={toggleDelivery}
          />
        );
      })}
      {
        // <DeliveryDate deliveryDate='July 22, 2020 - Aug. 3, 2020' />
      }
    </div>
  );
};

export default DeliveryRates;
