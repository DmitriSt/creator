import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { Currency } from '../../../../../models/cart.models';
import { Section } from '../../../../../models/checkout.models';
import { IExtendedFilterConfigItem } from '../../../../../models/commonPage.models';
import { updateCurrency } from '../../../../../services/cart.service';
import { getDeliveryRates, getPickupLocations } from '../../../../../services/checkout.service';
import { updateStoreCart } from '../../../../stores/cartStore/cart/cartActions';
import { setDeliveryRates, setPickupLocations } from '../../../../stores/checkoutStore/checkout/checkoutActions';
import { RootStateType } from '../../../../stores/store';
import { DependentDropdown } from '../../../sharedComponents/Dropdown/Dropdown';
import Loader from '../../../sharedComponents/Loader/Loader';
import styles from './currencyPicker.module.scss';

const CurrencyPicker = () => {
  const [isLoading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const currencyList = useSelector((state: RootStateType) => state.cartState.cartPage.currencies.list);
  const currentSection = useSelector((state: RootStateType) => state.checkoutState.user.currentSection);
  const chosenPickup = useSelector((state: RootStateType) => state.checkoutState.user.shipping.pickupAddress);
  const chosenRate = useSelector((state: RootStateType) => state.checkoutState.user.delivery.delivery);
  const cart = useSelector((state: RootStateType) => state.cartState.cart);

  if (!currencyList || !currencyList.length || !cart.lineItems || !cart.lineItems.length) return null;

  const restructureElement = (item: Currency) => {
    return {
      text: item.text,
      value: item.code,
    } as IExtendedFilterConfigItem;
  };

  const updateCartCurrency = async (item: IExtendedFilterConfigItem) => {
    try {
      if (cart.currency === item.value) return;
      setIsloading(true);
      const updatedCart = await updateCurrency(item.value);
      if (pathname.endsWith('/checkout') && (currentSection === Section.DELIVERY || !!chosenRate)) {
        const rates = await getDeliveryRates();
        dispatch(setDeliveryRates(rates.rateConfig));
      }
      if (pathname.endsWith('/checkout') && (currentSection === Section.SHIPPING || !!chosenPickup)) {
        const locations = await getPickupLocations();
        dispatch(setPickupLocations(locations));
      }
      dispatch(updateStoreCart(updatedCart));
      setIsloading(false);
    } catch (err) {
      setIsloading(false);
    }
  };

  const items = currencyList.map(restructureElement);

  return isLoading ? (
    <Loader isSmall isLocal />
  ) : (
    <DependentDropdown
      description='Currency'
      selected={restructureElement(currencyList.find((item) => item.code === cart.currency))}
      className={styles.dropdown}
      items={items}
      isReset={false}
      onChange={updateCartCurrency}
    />
  );
};

export default CurrencyPicker;
