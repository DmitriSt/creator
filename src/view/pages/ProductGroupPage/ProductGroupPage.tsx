import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { ParamsType } from '../../../models/commonPage.models';
import { getMenu } from '../../../services/common.service';
import { getProductGroupPageConfig, getProductGroupProducts } from '../../../services/productGroupPage.service';
import { checkSession } from '../../../services/session.service';
import Products from '../../components/productGroupComponents/Products/Products';
import Advertising from '../../components/sharedComponents/Advertising/Advertising';
import Footer from '../../components/sharedComponents/Footer/Footer';
import Loader from '../../components/sharedComponents/Loader/Loader';
import Menu from '../../components/sharedComponents/Menu/Menu';
import NotFoundStub from '../../components/sharedComponents/NotFoundStub/NotFoundStub';
import PageHeader from '../../components/sharedComponents/PageHeader/PageHeader';
// import Selector from '../../components/sharedComponents/Selector/Selector';
import resetStoreState from '../../stores/actions';
import isHeaderInfo from '../../stores/appStore/appSelectors';
import { updateMenu } from '../../stores/commonStore/commonActions';
import { initProductGroupPageStore } from '../../stores/productGroupPageStore/productGroupPageActions';
import { RootStateType } from '../../stores/store';
import styles from './productGroupPage.module.scss';

const ProductGroupPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams<ParamsType>();
  const [isError, setIsError] = useState(false);

  const menuItems = useSelector((state: RootStateType) => state.commonState.menu);
  const state = useSelector((state: RootStateType) => state.productGroupPageState);
  // const count = state.products?.length || 0;
  const header = useSelector(isHeaderInfo);
  const pageSetup = useSelector((state: RootStateType) => state.productGroupPageState.pageConfig);

  useEffect(() => {
    async function getConfig() {
      await checkSession();
      try {
        const data = await getProductGroupPageConfig(+id);
        const products = await getProductGroupProducts(+id);
        if (!data) {
          setIsError(true);
          return;
        }
        if (products && products.length) {
          data.products = products;
        }
        dispatch(initProductGroupPageStore(data));
      } catch (error) {
        if (error && error.status === 400) {
          setIsError(true);
        }
        return;
      }
      if (!menuItems) {
        const menu = await getMenu();
        dispatch(updateMenu(menu));
      }
    }
    getConfig();
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
      <h1 className={styles.title}>{state.pageConfig?.title || ''}</h1>
      {
        // <Selector count={count} filters={state.filtersConfig?.filters} sorting={state.filtersConfig?.sort} />
      }
      {state.products && <Products products={state.products} />}
      {pageSetup && pageSetup.showFooter && state.footer && <Footer footer={state.footer} />}
    </>
  ) : (
    <Loader />
  );
};

export default ProductGroupPage;
