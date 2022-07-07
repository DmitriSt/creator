import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PaymentType, Section, ShippingWay } from '../../../../models/checkout.models';
import { getCheckoutInfo, removeCheckoutInfo } from '../../../helpers/checkoutHelpers';
import {
  updateDeliveryInfo,
  updatePickupAddress,
  updateProvider,
  updateSection,
  updateShippingStatus,
  updateShippingWay,
} from '../../../stores/checkoutStore/user/userActions';
import { RootStateType } from '../../../stores/store';
import DeliverySection from '../DeliverySection/DeliverySection';
import PaymentSection from '../PaymentSection/PaymentSection';
import ShippingSection from '../ShippingSection/ShippingSection';

const OrderDetails = () => {
  const dispatch = useDispatch();
  const [isDeliverySectionVisited, setIsDeliverySectionVisited] = useState(false);
  const [isShippingSectionVisited, setIsShippingSectionVisited] = useState(false);
  const section = useSelector((state: RootStateType) => state.checkoutState.user.currentSection);
  const pickupLocations = useSelector((state: RootStateType) => state.checkoutState.checkout.pickupLocations);
  const providers = useSelector((state: RootStateType) => state.checkoutState.checkout.payment.providers);
  const rates = useSelector((state: RootStateType) => state.checkoutState.checkout.deliveryRates);

  const checkSessionStorage = () => {
    const info = getCheckoutInfo();
    if (info) {
      const { way, locationId, delivery } = info;
      if (way === ShippingWay.PICKUP && locationId && pickupLocations) {
        const chosenLocation = pickupLocations.find((location) => location.locationId === locationId);
        const paypal = providers.find((item) => item.type === PaymentType.EXPRESS_PAY);
        if (chosenLocation && paypal) {
          dispatch(updateShippingWay(ShippingWay.PICKUP));
          dispatch(updateSection(Section.PAYMENT));
          dispatch(updateProvider(paypal));
          dispatch(updatePickupAddress(chosenLocation));
          dispatch(updateShippingStatus(true));
          setIsShippingSectionVisited(true);
        }
      }
      if (way === ShippingWay.SHIP_TO_ADDRESS && delivery && rates) {
        const chosenDelivery = rates.options.find(({ code, name }) => code === delivery.code && name === delivery.name);
        if (chosenDelivery) {
          dispatch(updateDeliveryInfo({ delivery: chosenDelivery, isReady: true }));
          dispatch(updateSection(Section.PAYMENT));
          dispatch(updateShippingStatus(true));
          setIsDeliverySectionVisited(true);
          setIsShippingSectionVisited(true);
        }
      }
    } else {
      dispatch(updateSection(Section.SHIPPING));
    }
    removeCheckoutInfo();
  };

  useEffect(() => {
    checkSessionStorage();
  }, []);

  return (
    <div>
      <ShippingSection isOpen={section === Section.SHIPPING} isVisited={isShippingSectionVisited} />
      <DeliverySection isOpen={section === Section.DELIVERY} isVisited={isDeliverySectionVisited} />
      <PaymentSection isOpen={section === Section.PAYMENT} />
    </div>
  );
};

export default OrderDetails;
