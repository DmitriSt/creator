import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PickupLocation } from '../../../../../../models/checkout.models';
import { getPrecisionPrice } from '../../../../../helpers/cartHelpers';
import { cartCurrencySign } from '../../../../../stores/cartStore/cartSelectors';
import { updatePickupAddress, updateShippingStatus } from '../../../../../stores/checkoutStore/user/userActions';
import RadioButton from '../../../../sharedComponents/RadioButton/RadioButton';
import styles from './pickupItem.module.scss';
import WorkingTimetable from './WorkingTimetable/WorkingTimetable';

type PickupItemPropsType = {
  pickupLocation: PickupLocation;
  checked: boolean;
};

const Pickup = ({ pickupLocation, checked }: PickupItemPropsType) => {
  const dispatch = useDispatch();
  const currency = useSelector(cartCurrencySign);
  const pickupFee = getPrecisionPrice(+pickupLocation.pickupCost, currency);

  const changeAddress = async (item: PickupLocation) => {
    dispatch(updateShippingStatus(false));
    dispatch(updatePickupAddress(item));
  };

  return (
    <div className={styles.wrapper}>
      <RadioButton
        key={pickupLocation.locationId}
        label={pickupLocation.fullAddress}
        checked={checked}
        callback={() => changeAddress(pickupLocation)}
        id={`${pickupLocation.locationId}`}
        name='pickup_addresses'
        className={checked ? styles.radio_button : ''}
      />
      <WorkingTimetable hours={pickupLocation.openingHours} />
      <div className={styles.fee}>
        <span>Pickup fee:</span>
        <span className={styles.price}>{pickupFee}</span>
      </div>
    </div>
  );
};

export default Pickup;
