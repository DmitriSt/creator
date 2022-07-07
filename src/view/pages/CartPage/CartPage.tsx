import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCart, getCartPageConfig } from '../../../services/cart.service';
// import { getBillingAddress, getDeliveryAddress, getDeliveryRates } from '../../../services/checkout.service';
import { getRecommended } from '../../../services/common.service';
import { checkSession } from '../../../services/session.service';
import CartPageContent from '../../components/cartPageComponents/PageContent/PageContent';
import RecommendedContent from '../../components/productPageComponents/RecommendedContent/RecommendedContent';
// import Advertising from '../../components/sharedComponents/Advertising/Advertising';
import CheckoutHeader from '../../components/sharedComponents/CheckoutHeader/CheckoutHeader';
// import Footer from '../../components/sharedComponents/Footer/Footer';
import Loader from '../../components/sharedComponents/Loader/Loader';
import isHeaderInfo from '../../stores/appStore/appSelectors';
import { updateStoreCart } from '../../stores/cartStore/cart/cartActions';
import initCartPageStore from '../../stores/cartStore/cartPage/cartPageActions';
import { updateRecommended } from '../../stores/commonStore/commonActions';
import { RootStateType } from '../../stores/store';
import styles from './cartPage.module.scss';

const CartPage = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  const state = useSelector((state: RootStateType) => state.cartState.cartPage);
  const header = useSelector(isHeaderInfo);
  const recommended = useSelector((state: RootStateType) => state.commonState.recommended);
  const items = useSelector((state: RootStateType) => state.cartState.cart.lineItems);

  useEffect(() => {
    async function getInfo() {
      await checkSession();
      if (!recommended) {
        const res = await getRecommended();
        dispatch(updateRecommended(res));
      }
      if (!items || !items.length) {
        const cart = await getCart();
        dispatch(updateStoreCart(cart));
      }
      const config = await getCartPageConfig();
      dispatch(initCartPageStore(config));
      setIsLoaded(true);
    }
    getInfo();
  }, []);

  return isLoaded ? (
    <div className={styles.wrapper}>
      {
        // state.pageAlert && <Advertising alert={state.pageAlert} />
      }
      <div className={styles.content}>
        {state.showHeader && header && <CheckoutHeader content={header} />}
        <CartPageContent />
      </div>
      {recommended && !!recommended.length && (
        <RecommendedContent recommended={recommended} text='Customers Also Bought' />
      )}
      {
        // state.showFooter && state.footer && <Footer footer={state.footer} />
      }
    </div>
  ) : (
    <Loader />
  );
};

export default CartPage;
