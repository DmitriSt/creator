import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { ParamsType } from '../../../models/commonPage.models';
import { ThemesHeaderTypes } from '../../../models/themesPage.models';
import { getMenu } from '../../../services/common.service';
import { checkSession } from '../../../services/session.service';
import { getThemesPageConfig } from '../../../services/themesPage.service';
import Advertising from '../../components/sharedComponents/Advertising/Advertising';
import Footer from '../../components/sharedComponents/Footer/Footer';
import Loader from '../../components/sharedComponents/Loader/Loader';
import Menu from '../../components/sharedComponents/Menu/Menu';
import PageHeader from '../../components/sharedComponents/PageHeader/PageHeader';
import HeaderSearch from '../../components/themesPageComponents/HeaderSearch/HeaderSearch';
import HeaderSelector from '../../components/themesPageComponents/HeaderSelector/HeaderSelector';
import Themes from '../../components/themesPageComponents/Themes/Themes';
import resetStoreState from '../../stores/actions';
import isHeaderInfo from '../../stores/appStore/appSelectors';
import { updateMenu } from '../../stores/commonStore/commonActions';
import { RootStateType } from '../../stores/store';
import initThemesPageStore from '../../stores/themesStore/themesPage/themesPageActions';

const ThemesPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams<ParamsType>();

  const menuItems = useSelector((state: RootStateType) => state.commonState.menu);
  const pageSetup = useSelector((state: RootStateType) => state.themesState.themesPage.pageConfig);
  const state = useSelector((state: RootStateType) => state.themesState.themesPage);
  const header = useSelector(isHeaderInfo);

  useEffect(() => {
    let cleanupFunction = false;
    (async () => {
      await checkSession();
      const data = await getThemesPageConfig(+id);
      if (!menuItems) {
        const menu = await getMenu();
        dispatch(updateMenu(menu));
      }
      if (!cleanupFunction) dispatch(initThemesPageStore(data));
    })();
    return () => {
      cleanupFunction = true;
      dispatch(resetStoreState());
    };
  }, []);

  return state.isLoaded ? (
    <>
      {state.pageAlert && <Advertising alert={state.pageAlert} />}
      {pageSetup && pageSetup.showHeader && header && <PageHeader content={header} setup={pageSetup} />}
      {menuItems && <Menu items={menuItems} />}
      {pageSetup && pageSetup.searchPageType === ThemesHeaderTypes.Selector ? <HeaderSelector /> : <HeaderSearch />}
      <Themes />
      {pageSetup && pageSetup.showFooter && state.footer && <Footer footer={state.footer} />}
    </>
  ) : (
    <Loader />
  );
};

export default ThemesPage;
