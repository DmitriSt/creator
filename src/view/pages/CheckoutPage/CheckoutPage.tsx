import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { setSessionId } from '../../../httpClient';
import { CartPageStateType, ICart } from '../../../models/cart.models';
import {
  DeliveryWay,
  ICountryWithState,
  IShippingAddress,
  PaymentProvider,
  PickupLocation,
  ShippingWay,
} from '../../../models/checkout.models';
import { getCart, getCartPageConfig } from '../../../services/cart.service';
import {
  getBillingAddress,
  getCountriesWithStates,
  getDeliveryAddress,
  getDeliveryRates,
  getPaymentProviders,
  getPickupLocations,
} from '../../../services/checkout.service';
import { checkSession, removeSession, updateSessionInfo } from '../../../services/session.service';
import CheckoutPageContent from '../../components/checkoutPageComponents/PageContent/PageContent';
// import Advertising from '../../components/sharedComponents/Advertising/Advertising';
import CheckoutHeader from '../../components/sharedComponents/CheckoutHeader/CheckoutHeader';
// import Footer from '../../components/sharedComponents/Footer/Footer';
import Loader from '../../components/sharedComponents/Loader/Loader';
import { getCheckoutInfo, getIDFromQuery, isEmpty } from '../../helpers/checkoutHelpers';
import isHeaderInfo from '../../stores/appStore/appSelectors';
import { updateStoreCart } from '../../stores/cartStore/cart/cartActions';
import initCartPageStore from '../../stores/cartStore/cartPage/cartPageActions';
import {
  setCountries,
  setDeliveryRates,
  setPaymentProviders,
  setPickupLocations,
} from '../../stores/checkoutStore/checkout/checkoutActions';
import { resetInfo, updateBillingAddress, updateShippingAddress } from '../../stores/checkoutStore/user/userActions';
import { RootStateType } from '../../stores/store';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const { push, replace } = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);

  const state = useSelector((state: RootStateType) => state.cartState.cartPage);
  const countryList = useSelector((state: RootStateType) => state.checkoutState.checkout.countries);
  const header = useSelector(isHeaderInfo);
  const items = useSelector((state: RootStateType) => state.cartState.cart.lineItems);
  const shippingAddress = useSelector((state: RootStateType) => state.checkoutState.user.shipping.shippingAddress);
  const billingAddress = useSelector((state: RootStateType) => state.checkoutState.user.payment.billingAddress);

  const getData = async (): Promise<
    [
      CartPageStateType,
      PaymentProvider[],
      ICountryWithState[] | null,
      PickupLocation[] | null,
      IShippingAddress | null,
      IShippingAddress | null
    ]
  > => {
    const [config, locations, countries, providers] = await Promise.all([
      getCartPageConfig(),
      getPickupLocations(),
      !countryList && getCountriesWithStates(),
      getPaymentProviders(),
    ]);
    const [userAddress, userBillingAddress] = await Promise.allSettled([
      config.deliveryOptions !== DeliveryWay.Pickup && isEmpty(shippingAddress) && getDeliveryAddress(),
      isEmpty(billingAddress) && getBillingAddress(),
    ]);
    return [
      config,
      providers,
      Array.isArray(countries) ? countries : null,
      locations,
      userAddress.status === 'fulfilled' && typeof userAddress.value === 'object' ? userAddress.value : null,
      userBillingAddress.status === 'fulfilled' && typeof userBillingAddress.value === 'object'
        ? userBillingAddress.value
        : null,
    ];
  };

  const checkSessionStorage = async () => {
    const info = getCheckoutInfo();
    if (info && info.way === ShippingWay.SHIP_TO_ADDRESS && info.delivery) {
      const rate = await getDeliveryRates();
      dispatch(setDeliveryRates(rate.rateConfig));
    }
  };

  useEffect(() => {
    async function getInfo() {
      const sessionId = getIDFromQuery();
      if (sessionId && +sessionId && !Number.isNaN(+sessionId)) {
        setSessionId(+sessionId);
        const date = new Date(Date.now());
        date.setHours(date.getHours() + 2);
        updateSessionInfo(sessionId, date.toISOString());
        replace('/checkout');
      } else {
        await checkSession();
      }
      let cart: ICart | null = null;
      try {
        if (!items || !items.length) {
          cart = await getCart();
          if (!cart || !cart.lineItems || !cart.lineItems.length) {
            push('/cart');
            return;
          }
        }
      } catch (error: any) {
        if (sessionId && error && error.message === 'Network Error') {
          removeSession();
          window.location.reload();
        }
      }
      const [config, providers, countries, locations, userAddress, userBillingAddress] = await getData();
      if (!config.currencies.list.length && !(providers && providers.length)) {
        push('/cart');
        return;
      }
      dispatch(initCartPageStore(config));
      dispatch(setPaymentProviders(providers));
      dispatch(setPickupLocations(locations));
      if (countries) {
        dispatch(setCountries(countries));
      }
      if (userAddress) {
        dispatch(updateShippingAddress(userAddress));
      }
      if (userBillingAddress) {
        dispatch(updateBillingAddress(userBillingAddress));
      }
      if (cart) {
        dispatch(updateStoreCart(cart));
      }
      await checkSessionStorage();
      setIsLoaded(true);
    }
    getInfo();
    return () => {
      dispatch(resetInfo());
    };
  }, []);

  return isLoaded ? (
    <>
      {
        // state.pageAlert && <Advertising alert={state.pageAlert} />
      }
      {state.showHeader && header && <CheckoutHeader content={header} />}
      <CheckoutPageContent />
      {
        // state.showFooter && state.footer && <Footer footer={state.footer} />
      }
    </>
  ) : (
    <Loader />
  );
};

export default CheckoutPage;
