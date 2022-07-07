import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uniqid from 'uniqid';

import { HomePageConfigType, IHomePageInfoType } from '../../../models/homePage.models';
import { getAppTestimonials } from '../../../services/app.service';
import { getCart } from '../../../services/cart.service';
import { getMenu, getRecommendedMini } from '../../../services/common.service';
import { getAllProducts, getHomePageConfig, getSpecials, getUserPicks } from '../../../services/homePage.service';
import { checkSession } from '../../../services/session.service';
import ExploreAllContent from '../../components/homePageComponents/ExploreAllContent/ExploreAllContent';
import Footer from '../../components/homePageComponents/Footer/Footer';
import MainContent from '../../components/homePageComponents/MainContent/MainContent';
import RecommendedContent from '../../components/homePageComponents/RecommendedContent/RecommendedContent';
import Slider from '../../components/homePageComponents/Slider/Slider';
import Advertising from '../../components/sharedComponents/Advertising/Advertising';
import Carousel from '../../components/sharedComponents/Carousel/Carousel';
import Loader from '../../components/sharedComponents/Loader/Loader';
import Menu from '../../components/sharedComponents/Menu/Menu';
import PageHeader from '../../components/sharedComponents/PageHeader/PageHeader';
import resetStoreState from '../../stores/actions';
import { updateTestimonials } from '../../stores/appStore/appActions';
import isHeaderInfo from '../../stores/appStore/appSelectors';
import { updateStoreCart } from '../../stores/cartStore/cart/cartActions';
import { updateMenu } from '../../stores/commonStore/commonActions';
import initHomePageStore from '../../stores/homePageStore/homePageActions';
import pageConfig from '../../stores/homePageStore/homeSelectors';
import { RootStateType } from '../../stores/store';

const HomePage = () => {
  const dispatch = useDispatch();

  const state = useSelector((state: RootStateType) => state.homePageState);
  const testimonialsItems = useSelector((state: RootStateType) => state.appState.testimonials);
  const { menu: menuItems } = useSelector((state: RootStateType) => state.commonState);
  const pageSetup = useSelector(pageConfig);
  const header = useSelector(isHeaderInfo);
  const cardId = useSelector((state: RootStateType) => state.cartState.cart.cartId);

  useEffect(() => {
    async function getConfig() {
      let config: HomePageConfigType | null = null;
      const newID = await checkSession();
      if (!cardId || cardId !== newID) {
        const cart = await getCart();
        dispatch(updateStoreCart(cart));
      }
      try {
        config = await getHomePageConfig();
      } catch (err) {
        return;
      }
      const [testimonials, menu, products, recommended, specials, userpicks] = await Promise.allSettled([
        config.pageConfig && config.pageConfig.showFooter && !testimonialsItems && getAppTestimonials(),
        !menuItems ? getMenu() : null,
        getAllProducts(),
        getRecommendedMini(),
        getSpecials(),
        getUserPicks(),
      ]);
      const data: IHomePageInfoType = {
        ...config,
        userPicks: userpicks.status === 'fulfilled' ? userpicks.value : null,
        specials: specials.status === 'fulfilled' ? specials.value : null,
        recommended: recommended.status === 'fulfilled' ? recommended.value : null,
        products: products.status === 'fulfilled' ? products.value : null,
      };
      dispatch(initHomePageStore(data));
      if (menu && menu.status === 'fulfilled' && Array.isArray(menu.value)) {
        dispatch(updateMenu(menu.value));
      }
      if (testimonials && testimonials.status === 'fulfilled' && Array.isArray(testimonials.value)) {
        dispatch(updateTestimonials(testimonials.value));
      }
    }
    getConfig();
    return () => {
      dispatch(resetStoreState());
    };
  }, []);

  const showInOrder = () =>
    state.order.map((item) => {
      switch (item) {
        case 'bestOffers':
          return state.bestOffers && !!state.bestOffers.slides.length && <Slider key={uniqid()} />;
        case 'userPicks':
          return state.userPicks && !!state.userPicks.length && <Carousel key={uniqid()} products={state.userPicks} />;
        case 'specials':
          return state.specials && !!state.specials.length && <MainContent key={uniqid()} />;
        case 'recommended':
          return state.recommended && <RecommendedContent key={uniqid()} />;
        case 'products':
          return state.products && <ExploreAllContent key={uniqid()} />;
        default:
          return <React.Fragment key={uniqid()} />;
      }
    });

  return state.isLoaded ? (
    <>
      {state.pageAlert && <Advertising alert={state.pageAlert} />}
      {pageSetup && pageSetup.showHeader && header && <PageHeader content={header} setup={pageSetup} />}
      {menuItems && <Menu items={menuItems} />}
      {showInOrder()}
      {pageSetup && pageSetup.showFooter && state.footer && <Footer />}
    </>
  ) : (
    <Loader />
  );
};

export default HomePage;
