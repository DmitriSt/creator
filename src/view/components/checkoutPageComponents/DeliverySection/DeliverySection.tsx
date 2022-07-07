import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Section, SectionPropsType, ShippingWay } from '../../../../models/checkout.models';
import { setDeliveryRate } from '../../../../services/checkout.service';
import { updateStoreCart } from '../../../stores/cartStore/cart/cartActions';
import {
  updateDeliveryStatus,
  updatePaymentStatus,
  updateSection,
} from '../../../stores/checkoutStore/user/userActions';
import { RootStateType } from '../../../stores/store';
import CheckoutSection from '../CheckoutSection/CheckoutSection';
import DeliveryRates from './DeliveryRates/DeliveryRates';
import DeliveryVariantInfo from './DeliveryRates/DeliveryVariant/DeliveryVariantInfo/DeliveryVariantInfo';
import styles from './deliverySection.module.scss';

const DeliverySection = ({ isOpen, isVisited = false }: SectionPropsType) => {
  const dispatch = useDispatch();
  const { delivery } = useSelector((state: RootStateType) => state.checkoutState.user.delivery);
  const deliverySetup = useSelector((state: RootStateType) => state.checkoutState.checkout.deliveryRates);
  const isShippingReady = useSelector((state: RootStateType) => state.checkoutState.user.shipping.isReady);
  const shippingWay = useSelector((state: RootStateType) => state.checkoutState.user.shipping.shippingWay);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisited) {
      setIsDirty(isVisited);
    }
  }, [isVisited]);

  const openSection = useCallback(() => dispatch(updateSection(Section.DELIVERY)), []);

  const saveData = async () => {
    try {
      setIsLoading(true);
      const cart = await setDeliveryRate(delivery.code);
      dispatch(updateStoreCart(cart));
      dispatch(updateSection(Section.PAYMENT));
      setIsDirty(true);
      dispatch(updateDeliveryStatus(true));
      dispatch(updatePaymentStatus(false));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <CheckoutSection
      disabled={false}
      isDirty={isDirty && shippingWay === ShippingWay.SHIP_TO_ADDRESS && isShippingReady}
      openSection={openSection}
      isOpen={isOpen}
      step='2'
      title={Section.DELIVERY}
      callback={saveData}
      isLoading={isLoading}
    >
      {isOpen && <DeliveryRates />}
      {!isOpen && isDirty && delivery && (
        <div className={styles.choosen_delivery}>
          <DeliveryVariantInfo option={delivery} provider={deliverySetup.provider} />
          {
            // <DeliveryDate className={styles.date} deliveryDate='July 22, 2020 - Aug. 3, 2020' />
          }
        </div>
      )}
    </CheckoutSection>
  );
};

export default DeliverySection;
