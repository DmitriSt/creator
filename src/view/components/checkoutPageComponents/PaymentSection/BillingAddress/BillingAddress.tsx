import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IShippingAddress, ShippingWay } from '../../../../../models/checkout.models';
import { updateBillingAddress, updatePaymentStatus } from '../../../../stores/checkoutStore/user/userActions';
import { RootStateType } from '../../../../stores/store';
import { DependentCheckbox } from '../../../sharedComponents/Checkbox/Checkbox';
import ShipToAddress from '../../ShippingSection/ShipToAddress/ShipToAddress';
import styles from './billingAddress.module.scss';

type BillingAddresspropsType = {
  callback: (val: boolean) => void;
  initialValue: boolean;
};

const BillingAddress = ({ callback, initialValue }: BillingAddresspropsType) => {
  const dispatch = useDispatch();
  const shippingWay = useSelector((state: RootStateType) => state.checkoutState.user.shipping.shippingWay);
  const { billingAddress } = useSelector((state: RootStateType) => state.checkoutState.user.payment);

  const [isBillingForm, setIsBillingForm] = useState(initialValue || shippingWay === ShippingWay.PICKUP);

  useEffect(() => callback(isBillingForm), [isBillingForm]);

  const toggleAddressForm = (newVal: boolean) => {
    setIsBillingForm(!newVal);
    callback(!newVal);
    dispatch(updatePaymentStatus(false));
  };

  const updateAddress = (dto: IShippingAddress) => {
    dispatch(updatePaymentStatus(false));
    dispatch(updateBillingAddress(dto));
  };

  return (
    <div>
      {shippingWay === ShippingWay.PICKUP ? (
        <p className={styles.billing_text}>Billing address</p>
      ) : (
        <DependentCheckbox label='Billing address as shipping' checked={!isBillingForm} onChange={toggleAddressForm} />
      )}
      {isBillingForm && <ShipToAddress config={billingAddress} callback={updateAddress} />}
    </div>
  );
};

export default BillingAddress;
