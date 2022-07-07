import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { setSessionId } from '../../../httpClient';
import {
  getCart,
  getCartPageConfig,
  getDataFromStorage,
  removeDataFromStorage,
  saveDataToStorage,
} from '../../../services/cart.service';
import { deleteSession } from '../../../services/session.service';
import RecommendedContent from '../../components/productPageComponents/RecommendedContent/RecommendedContent';
// import Advertising from '../../components/sharedComponents/Advertising/Advertising';
import CheckoutHeader from '../../components/sharedComponents/CheckoutHeader/CheckoutHeader';
// import Footer from '../../components/sharedComponents/Footer/Footer';
import Loader from '../../components/sharedComponents/Loader/Loader';
import NotFoundStub from '../../components/sharedComponents/NotFoundStub/NotFoundStub';
import ThanksPageContent from '../../components/thanksPageComponents/ThanksPageContent/ThanksPageContent';
import { getIDFromQuery, removeCheckoutInfo } from '../../helpers/checkoutHelpers';
import resetState from '../../stores/actions';
import isHeaderInfo from '../../stores/appStore/appSelectors';
import { updateStoreCart } from '../../stores/cartStore/cart/cartActions';
import initCartPageStore from '../../stores/cartStore/cartPage/cartPageActions';
import { RootStateType } from '../../stores/store';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const { replace } = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const state = useSelector((state: RootStateType) => state.cartState.cartPage);
  const header = useSelector(isHeaderInfo);
  const recommended = useSelector((state: RootStateType) => state.commonState.recommended);
  const cart = useSelector((state: RootStateType) => state.cartState.cart);
  const config = useSelector((state: RootStateType) => state.cartState.cartPage);

  useEffect(() => {
    async function getData() {
      removeCheckoutInfo();
      const sessionId = getIDFromQuery();
      try {
        if (cart && cart.cartId && config) {
          await deleteSession();
          saveDataToStorage(cart, config);
          return;
        }
        const savedData = getDataFromStorage();
        const payedID = getIDFromQuery('PayerID');
        if (!payedID && !savedData) {
          setIsError(true);
          return;
        }
        if (sessionId && +sessionId && !Number.isNaN(+sessionId)) {
          setSessionId(+sessionId);
          replace('/thankyou');
          const config = await getCartPageConfig();
          const cart = await getCart();
          await deleteSession();
          saveDataToStorage(cart, config);
          dispatch(initCartPageStore(config));
          dispatch(updateStoreCart(cart));
        } else if (savedData) {
          dispatch(initCartPageStore(savedData.config));
          dispatch(updateStoreCart(savedData.cart));
        } else setIsError(true);
      } catch (error: any) {
        if (error && (error.status === 400 || error.message === 'Network Error')) {
          const sessionidRaw = sessionStorage.getItem('sessionId');
          if (sessionidRaw && +sessionidRaw && !Number.isNaN(+sessionidRaw) && +sessionId !== +sessionidRaw) {
            setSessionId(+sessionidRaw);
          }
          setIsError(true);
        }
      } finally {
        setIsLoaded(true);
      }
    }
    getData();
    return () => {
      removeDataFromStorage();
      dispatch(updateStoreCart(null));
      dispatch(resetState());
    };
  }, []);

  if (isError) return <NotFoundStub />;

  return isLoaded ? (
    <>
      {
        // state.pageAlert && <Advertising alert={state.pageAlert} />
      }
      {state.showHeader && header && <CheckoutHeader content={header} />}
      <ThanksPageContent />
      {recommended && !!recommended.length && (
        <RecommendedContent recommended={recommended} text='You Might Also like' />
      )}
      {
        // state.showFooter && state.footer && <Footer footer={state.footer} />
      }
    </>
  ) : (
    <Loader />
  );
};

export default CheckoutPage;
