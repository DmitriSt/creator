import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { ParamsType } from '../../../models/commonPage.models';
import { getAppTestimonials } from '../../../services/app.service';
import { getMenu, getRecommended } from '../../../services/common.service';
import { getProductPageConfig } from '../../../services/productPage.service';
import { checkSession } from '../../../services/session.service';
import ProductSection from '../../components/productPageComponents/ProductSection/ProductSection';
import RecommendedContent from '../../components/productPageComponents/RecommendedContent/RecommendedContent';
import TestimonialsContent from '../../components/productPageComponents/TestimonialsContent/TestimonialsContent';
import Advertising from '../../components/sharedComponents/Advertising/Advertising';
import Footer from '../../components/sharedComponents/Footer/Footer';
import Loader from '../../components/sharedComponents/Loader/Loader';
import Menu from '../../components/sharedComponents/Menu/Menu';
import NotFoundStub from '../../components/sharedComponents/NotFoundStub/NotFoundStub';
import PageHeader from '../../components/sharedComponents/PageHeader/PageHeader';
import resetStoreState from '../../stores/actions';
import { updateTestimonials } from '../../stores/appStore/appActions';
import isHeaderInfo from '../../stores/appStore/appSelectors';
import { updateMenu, updateRecommended } from '../../stores/commonStore/commonActions';
import initProductPageStore from '../../stores/productPageStore/productPageActions';
import getPageConfig from '../../stores/productPageStore/productPageSelectors';
import { RootStateType } from '../../stores/store';

const ProductPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams<ParamsType>();
  const [isError, setIsError] = useState(false);

  const menuItems = useSelector((state: RootStateType) => state.commonState.menu);
  const testimonials = useSelector((state: RootStateType) => state.appState.testimonials);
  const pageSetup = useSelector(getPageConfig);
  const state = useSelector((state: RootStateType) => state.productPageState);
  const header = useSelector(isHeaderInfo);
  const recommended = useSelector((state: RootStateType) => state.commonState.recommended);

  useEffect(() => {
    (async () => {
      await checkSession();
      try {
        const data = await getProductPageConfig(+id);
        if (!data) {
          setIsError(true);
          return;
        }
        dispatch(initProductPageStore(data));
      } catch (err) {
        setIsError(true);
      }
      const [menuInfo, testimonialInfo, recommendedInfo] = await Promise.allSettled([
        !menuItems && getMenu(),
        !testimonials && getAppTestimonials(),
        !recommended && getRecommended(),
      ]);
      if (menuInfo.status === 'fulfilled' && Array.isArray(menuInfo.value)) {
        dispatch(updateMenu(menuInfo.value));
      }
      if (testimonialInfo.status === 'fulfilled' && Array.isArray(testimonialInfo.value)) {
        dispatch(updateTestimonials(testimonialInfo.value));
      }
      if (recommendedInfo.status === 'fulfilled' && Array.isArray(recommendedInfo.value)) {
        dispatch(updateRecommended(recommendedInfo.value));
      }
    })();
    return () => {
      dispatch(resetStoreState());
    };
  }, [id]);

  if (isError) return <NotFoundStub />;

  return state.isLoaded ? (
    <>
      {state.pageAlert && <Advertising alert={state.pageAlert} />}
      {pageSetup && pageSetup.showHeader && header && <PageHeader content={header} setup={pageSetup} />}
      {menuItems && <Menu items={menuItems} />}
      {state.details && <ProductSection />}
      {recommended && !!recommended.length && <RecommendedContent recommended={recommended} text='You may also like' />}
      {testimonials && <TestimonialsContent />}
      {pageSetup && pageSetup.showFooter && state.footer && <Footer footer={state.footer} />}
    </>
  ) : (
    <Loader />
  );
};

export default ProductPage;
