import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { ActiveProductDTO } from '../../../models/artwork.models';
import { ParamsType } from '../../../models/commonPage.models';
import { getMenu } from '../../../services/common.service';
import { getProductPageConfig } from '../../../services/productPage.service';
import { checkSession } from '../../../services/session.service';
import PageContent from '../../components/artworkPageComponents/PageContent/PageContent';
import Advertising from '../../components/sharedComponents/Advertising/Advertising';
import Footer from '../../components/sharedComponents/Footer/Footer';
import Loader from '../../components/sharedComponents/Loader/Loader';
import Menu from '../../components/sharedComponents/Menu/Menu';
import PageHeader from '../../components/sharedComponents/PageHeader/PageHeader';
import isHeaderInfo from '../../stores/appStore/appSelectors';
import updateActiveProduct from '../../stores/artworkPageStore/activeProduct/activeProductActions';
import { updateMenu } from '../../stores/commonStore/commonActions';
import { RootStateType } from '../../stores/store';

const ArtworkPage = () => {
  const { id } = useParams<ParamsType>();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  const menuItems = useSelector((state: RootStateType) => state.commonState.menu);
  const state = useSelector((state: RootStateType) => state.artworkState.artworkPageState);
  const header = useSelector(isHeaderInfo);
  const { id: productId } = useSelector((state: RootStateType) => state.artworkState.activeProduct);

  useEffect(() => {
    async function getConfig() {
      await checkSession();
      const data = await getProductPageConfig(+id);
      const dto: ActiveProductDTO = {
        filters: data.priceCalculatorConfig || null,
        id: +id,
        price: null,
      };
      if (!menuItems) {
        const menu = await getMenu();
        dispatch(updateMenu(menu));
      }
      dispatch(updateActiveProduct(dto));
      setIsLoaded(true);
    }
    if (!productId) {
      getConfig();
    } else {
      setIsLoaded(true);
    }
    return () => {
      dispatch(updateActiveProduct(null));
    };
  }, [id]);

  return isLoaded ? (
    <>
      {state.pageAlert && <Advertising alert={state.pageAlert} />}
      {state.pageConfig.showHeader && header && <PageHeader content={header} setup={state.pageConfig} />}
      {menuItems && <Menu items={menuItems} />}
      <PageContent />
      {state.pageConfig.showFooter && state.footer && <Footer footer={state.footer} />}
    </>
  ) : (
    <Loader />
  );
};

export default ArtworkPage;
