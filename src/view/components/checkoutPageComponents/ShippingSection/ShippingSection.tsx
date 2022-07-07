import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { DeliveryWay, Section, SectionPropsType, ShippingWay } from '../../../../models/checkout.models';
import { getDeliveryRates, setDeliveryAddress, setPickupLocation } from '../../../../services/checkout.service';
import { validateAddress } from '../../../helpers/checkoutHelpers';
import { updateStoreCart } from '../../../stores/cartStore/cart/cartActions';
import { setDeliveryRates } from '../../../stores/checkoutStore/checkout/checkoutActions';
import {
  updateDelivery,
  updateDeliveryStatus,
  updatePaymentStatus,
  updateSection,
  updateShippingStatus,
  updateShippingWay,
} from '../../../stores/checkoutStore/user/userActions';
import { RootStateType } from '../../../stores/store';
import RadioButton from '../../sharedComponents/RadioButton/RadioButton';
import CheckoutSection from '../CheckoutSection/CheckoutSection';
import ShippingConfigPreview from './ShippingConfigPreview/ShippingConfigPreview';
import styles from './shippingSection.module.scss';
import TabContent from './TabContent/TabContent';

const ShippingSection = ({ isOpen, isVisited }: SectionPropsType) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const deliveryWay = useSelector((state: RootStateType) => state.cartState.cartPage.deliveryOptions);
  const { shippingWay, shippingAddress, pickupAddress } = useSelector(
    (state: RootStateType) => state.checkoutState.user.shipping
  );
  const pickupLocations = useSelector((state: RootStateType) => state.checkoutState.checkout.pickupLocations);
  const [disabled, setDisabled] = useState(true);
  const [tab, setTab] = useState(ShippingWay.SHIP_TO_ADDRESS);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisited) {
      setIsDirty(isVisited);
    }
  }, [isVisited]);

  useEffect(() => {
    if (isOpen) {
      setTab(shippingWay);
      setIsDirty(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const tab =
      deliveryWay === DeliveryWay.Delivery || deliveryWay === DeliveryWay.PickupAndDelivery
        ? ShippingWay.SHIP_TO_ADDRESS
        : ShippingWay.PICKUP;
    setTab(tab);
  }, [deliveryWay]);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    if (tab === ShippingWay.SHIP_TO_ADDRESS) {
      timerId = setTimeout(() => {
        const isValidAddress = shippingAddress ? validateAddress(shippingAddress) : false;
        setDisabled(!isValidAddress);
      }, 200);
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [tab, shippingAddress]);

  useEffect(() => {
    if (tab === ShippingWay.PICKUP) {
      setDisabled(!pickupAddress);
    }
  }, [tab, pickupAddress]);

  useEffect(() => {
    dispatch(updateShippingStatus(false));
  }, [tab]);

  const getUpdatedCart = async () => {
    if (tab === ShippingWay.SHIP_TO_ADDRESS) {
      return setDeliveryAddress({
        ...shippingAddress,
        companyName: '',
        apartmentNumber: '',
        phone2: '',
      });
    }
    return setPickupLocation(pickupAddress.locationId);
  };

  const openShippingSection = useCallback(() => dispatch(updateSection(Section.SHIPPING)), []);

  const saveData = async () => {
    try {
      setIsLoading(true);
      // await new Promise((res) => setTimeout(() => res('asd'), 4000000));
      const cart = await getUpdatedCart();
      if (tab === ShippingWay.SHIP_TO_ADDRESS) {
        const rate = await getDeliveryRates();
        if (!rate) {
          throw Error();
        }
        dispatch(setDeliveryRates(rate.rateConfig));
        dispatch(updateDelivery(rate.chosenRate));
      }
      if (!cart.lineItems.length) {
        dispatch(updateStoreCart(cart));
        push('/cart');
      }
      dispatch(updateStoreCart(cart));
      dispatch(updateShippingWay(tab));
      dispatch(updateShippingStatus(true));
      dispatch(updateDeliveryStatus(false));
      if (tab === ShippingWay.PICKUP) {
        dispatch(updatePaymentStatus(false));
        dispatch(updateDelivery(null));
        dispatch(updateSection(Section.PAYMENT));
      } else {
        dispatch(updateSection(Section.DELIVERY));
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const toggleTab = useCallback((id: string) => setTab(id as ShippingWay), []);

  return (
    <CheckoutSection
      step='1'
      openSection={openShippingSection}
      isOpen={isOpen}
      isDirty={isDirty}
      title={Section.SHIPPING}
      callback={saveData}
      disabled={disabled}
      isLoading={isLoading}
    >
      {isOpen && (
        <>
          {deliveryWay === DeliveryWay.PickupAndDelivery && pickupLocations && pickupLocations.length && (
            <div className={styles.controls}>
              <RadioButton
                label='Ship to address'
                checked={tab === ShippingWay.SHIP_TO_ADDRESS}
                callback={toggleTab}
                id={ShippingWay.SHIP_TO_ADDRESS}
                name='shipping'
                className={styles.radio_button}
              />
              <RadioButton
                label='Pick up'
                checked={tab === ShippingWay.PICKUP}
                callback={toggleTab}
                id={ShippingWay.PICKUP}
                name='shipping'
                className={styles.radio_button}
              />
            </div>
          )}
          <TabContent tab={tab} />
        </>
      )}
      {!isOpen && isDirty && <ShippingConfigPreview />}
    </CheckoutSection>
  );
};

export default ShippingSection;
