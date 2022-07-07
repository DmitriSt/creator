import React from 'react';
import { useSelector } from 'react-redux';

import { ShippingWay } from '../../../../../models/checkout.models';
import { generateFullAddress } from '../../../../helpers/checkoutHelpers';
import { RootStateType } from '../../../../stores/store';
import styles from './shippingConfigPreview.module.scss';

const ShippingConfigPreview = () => {
  const { shippingAddress, shippingWay: tab, pickupAddress } = useSelector(
    (state: RootStateType) => state.checkoutState.user.shipping
  );

  const name = shippingAddress && `${shippingAddress.firstName} ${shippingAddress.lastName}`;
  const phone = shippingAddress && shippingAddress.phone1;
  const fullAddress = shippingAddress && generateFullAddress(shippingAddress);
  return (
    <div className={styles.wrapper}>
      {tab === ShippingWay.PICKUP ? (
        <>
          <p className={styles.label}>Pickup from</p>
          <pre className={styles.address}>{pickupAddress ? pickupAddress.fullAddress : ''}</pre>
        </>
      ) : (
        <>
          <div className={styles.user_info}>
            <p className={styles.name}>{name}</p>
            <p>{phone}</p>
          </div>
          <pre className={styles.address}>{fullAddress}</pre>
        </>
      )}
    </div>
  );
};

export default ShippingConfigPreview;
