import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { getRoundedPrice } from '../../../../helpers/cartHelpers';
import { cartCurrencySign, getCartTotal } from '../../../../stores/cartStore/cartSelectors';
import PlaceOrderButton from '../../../checkoutPageComponents/PlaceOrderButton/PlaceOrderButton';
import Button from '../../../sharedComponents/Button/Button';
import styles from './cartSummaryButton.module.scss';

const CartSummaryButton = () => {
  const total = useSelector(getCartTotal);
  const currency = useSelector(cartCurrencySign);
  const price = getRoundedPrice(total, currency);
  const { pathname } = useLocation();
  const isCheckoutPage = pathname.endsWith('/checkout');

  return isCheckoutPage ? (
    <PlaceOrderButton />
  ) : (
    <Button linkTo='/checkout' value={`Checkout ${price}`} className={styles.button} />
  );
};

export default CartSummaryButton;
