import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { PaymentResponseCode, PaymentType, ShippingWay } from '../../../../models/checkout.models';
import { getProviderData, payWithCard } from '../../../../services/checkout.service';
import { getRoundedPrice } from '../../../helpers/cartHelpers';
import { generateCardDTO, setCheckoutInfo } from '../../../helpers/checkoutHelpers';
import { cartCurrencySign, getCartTotal } from '../../../stores/cartStore/cartSelectors';
import { RootStateType } from '../../../stores/store';
import Button from '../../sharedComponents/Button/Button';
import styles from './placeOrderButton.module.scss';

const PlaceOrderButton = () => {
  const { push } = useHistory();
  const [loading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const { provider, card } = useSelector((state: RootStateType) => state.checkoutState.user.payment);
  const { isReady: isShippingReady, pickupAddress } = useSelector(
    (state: RootStateType) => state.checkoutState.user.shipping
  );
  const shippingWay = useSelector((state: RootStateType) => state.checkoutState.user.shipping.shippingWay);
  const { isReady: isPaymentReady } = useSelector((state: RootStateType) => state.checkoutState.user.payment);
  const { isReady: isDeliveryReady, delivery } = useSelector(
    (state: RootStateType) => state.checkoutState.user.delivery
  );
  const total = useSelector(getCartTotal);
  const currency = useSelector(cartCurrencySign);
  const price = getRoundedPrice(total, currency);

  const isValidData =
    isShippingReady && (shippingWay === ShippingWay.PICKUP ? true : isDeliveryReady) && isPaymentReady;

  useEffect(() => {
    if (!isValidData) {
      setErrorText('');
    }
  }, [isValidData]);

  const getCurrentURL = () => {
    const { origin, pathname } = window.location;
    const additionalPathname = pathname.split('checkout')[0];
    return `${origin}${additionalPathname}`;
  };

  const generateErrorText = (code: PaymentResponseCode) => {
    if (code === PaymentResponseCode.Declined) {
      return 'Your card was declined. Please, try another one.';
    }
    return 'Something went wrong. Please, try again.';
  };

  const placeOrder = async () => {
    if (!isValidData || !provider) return;
    try {
      setErrorText('');
      setIsLoading(true);
      if (provider.type === PaymentType.DIRECT_PAY) {
        const dto = generateCardDTO(card);
        const code = await payWithCard(dto);
        if (code === PaymentResponseCode.Approved) {
          setIsLoading(false);
          push('/thankyou');
        } else {
          setErrorText(generateErrorText(code));
        }
      }
      if (provider.type === PaymentType.EXPRESS_PAY) {
        const { data, serviceUrl } = await getProviderData(provider.provider);
        const params = new URLSearchParams();
        const url = getCurrentURL();
        Object.entries(data).forEach((item) => {
          if (item[0] === 'rm') {
            params.append(item[0], '1');
            return;
          }
          const isReturn = item[0] === 'cancel_return' || item[0] === 'return';
          params.append(item[0], isReturn ? `${url}${item[1]}` : item[1]);
        });
        const href = `${serviceUrl}?${params.toString()}`;
        setCheckoutInfo(shippingWay, pickupAddress, delivery);
        // console.log(`${serviceUrl}?`);
        // console.log(params.toString());
        window.location.href = href;
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorText('Something went wrong. Please, try again.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <Button
        value={`Place Order ${price}`}
        onClick={placeOrder}
        isLoading={loading}
        className={`${styles.button} ${isValidData ? '' : styles.disabled}`}
      />
      {!!errorText && <p className={styles.error}>{errorText}</p>}
    </div>
  );
};

export default PlaceOrderButton;
