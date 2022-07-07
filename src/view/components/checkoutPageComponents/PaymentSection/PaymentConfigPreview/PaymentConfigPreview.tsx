import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { PaymentType, ShippingWay } from '../../../../../models/checkout.models';
import { ReactComponent as Visa } from '../../../../assets/images/cart/visa.svg';
import { generateFullAddress } from '../../../../helpers/checkoutHelpers';
import { RootStateType } from '../../../../stores/store';
import styles from './paymentConfigPreview.module.scss';

type PaymentConfigPreviewPropsType = {
  isBillingForm: boolean;
};

const PaymentConfigPreview = ({ isBillingForm }: PaymentConfigPreviewPropsType) => {
  const { shippingAddress, shippingWay } = useSelector((state: RootStateType) => state.checkoutState.user.shipping);
  const { card, provider, billingAddress } = useSelector((state: RootStateType) => state.checkoutState.user.payment);
  const [address] = useState(isBillingForm ? billingAddress : shippingAddress);
  const [isPickup] = useState(shippingWay === ShippingWay.PICKUP);

  const name = `${address.firstName} ${address.lastName}`;
  const phone = address.phone1;
  const fullAddress = generateFullAddress(address);
  const cardMaskedNumber = provider.type === PaymentType.DIRECT_PAY && `**** ${card.number.slice(-4)}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.user_block}>
        <div className={styles.card_info}>
          {cardMaskedNumber ? (
            <>
              <div className={styles.img_wrapper}>
                <Visa />
              </div>
              <p className={styles.card_number}>{cardMaskedNumber}</p>
            </>
          ) : (
            <p className={styles.card_number}>{provider.provider}</p>
          )}
        </div>
        <p className={styles.name}>{name}</p>
      </div>
      <div className={styles.address_block}>
        {(!isPickup || provider.type === PaymentType.DIRECT_PAY) && (
          <div>
            <pre className={styles.address}>{fullAddress}</pre>
            <p>{phone}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentConfigPreview;
