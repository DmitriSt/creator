import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IShippingAddress } from '../../../../../models/checkout.models';
import { updateShippingAddress, updateShippingStatus } from '../../../../stores/checkoutStore/user/userActions';
import { RootStateType } from '../../../../stores/store';
import ShipToAddress from '../ShipToAddress/ShipToAddress';

const ShippingAddress = () => {
  const dispatch = useDispatch();
  const shippingAddress = useSelector((state: RootStateType) => state.checkoutState.user.shipping.shippingAddress);

  const updateAddress = useCallback(
    (dto: IShippingAddress) => {
      dispatch(updateShippingStatus(false));
      dispatch(updateShippingAddress(dto));
    },
    [shippingAddress]
  );

  return <ShipToAddress config={shippingAddress} callback={updateAddress} />;
};

export default ShippingAddress;
