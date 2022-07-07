import './styles/global.scss';
import './styles/fonts.scss';
import './styles/swiper.scss';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { INewImage } from '../business/interfaces/interfaces';
import FilesManager from '../business/managers/FilesManager';
import ThumbnailManager from '../business/managers/ThumbnailManager';
import { setSessionId } from '../httpClient';
import { AppSetupType } from '../models/app.models';
import { ApplicationPaths } from '../models/constants/authorization';
import { getAppConfig } from '../services/app.service';
import { getCart, removeDataFromStorage } from '../services/cart.service';
import { checkSession } from '../services/session.service';
import AuthorizationRoutes from './components/authorizationComponents/AuthorizationRoutes';
import ScrollToTop from './components/ScrollToTop';
import Loader from './components/sharedComponents/Loader/Loader';
import NotFoundStub from './components/sharedComponents/NotFoundStub/NotFoundStub';
import { applyBrandColor } from './helpers/utils';
// import ArtworkPage from './pages/ArtworkPage/ArtworkPage';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import DesignerPage from './pages/DesignerPage/DesignerPage';
import HomePage from './pages/HomePage/HomePage';
import ProductGroupPage from './pages/ProductGroupPage/ProductGroupPage';
import ProductPage from './pages/ProductPage/ProductPage';
import ThanksPage from './pages/ThanksPage/ThanksPage';
// import ThemesPage from './pages/ThemesPage/ThemesPage';
import { initAppStore } from './stores/appStore/appActions';
import { updateStoreCart } from './stores/cartStore/cart/cartActions';
import {
  setChunksCount,
  setClearChunks,
  setImageData,
  setImageProgress,
  setNewThumbnails,
} from './stores/designerStore/tabBar/tabBarActions';
import { RootStateType } from './stores/store';

type AppPropsType = {
  config: AppSetupType;
};

const App = ({ config = { apiRoot: '', baseUrl: '/' } }: AppPropsType) => {
  const dispatch = useDispatch();

  const isLoaded = useSelector((state: RootStateType) => state.appState.isLoaded);

  const callbackThumbnails = (newImages: INewImage[]) => {
    dispatch(setNewThumbnails(newImages));
  };

  const callbackProgress = (percentage: number, imageData: any) => {
    dispatch(setImageProgress(percentage));
    if (percentage === 100) {
      dispatch(setImageData({ image: imageData ? imageData.imageInfo : {} }));
    }
  };

  const callbackChunkCount = (chunksCount: number, finish: boolean) => {
    if (finish) dispatch(setClearChunks());
    dispatch(setChunksCount(chunksCount));
  };

  useEffect(() => {
    async function getConfig() {
      const sessionid = await checkSession();
      if (sessionid) {
        setSessionId(sessionid);
      }
      const setup = await getAppConfig();
      applyBrandColor(setup.typography.menuColor);
      try {
        const { pathname } = window.location;
        if (!pathname.includes('thankyou')) {
          removeDataFromStorage();
        }
        const isCartReq =
          !pathname.endsWith('/cart') && !pathname.endsWith('/checkout') && !pathname.includes('thankyou');
        if (isCartReq) {
          const cart = await getCart();
          dispatch(updateStoreCart(cart));
        }
      } catch (error) {
        console.log(error);
      }
      dispatch(initAppStore(setup));
    }
    getConfig();
    ThumbnailManager.setup(callbackThumbnails);
    FilesManager.setup(callbackProgress);
    FilesManager.allChunksCountCallback(callbackChunkCount);
  }, []);

  return (
    <>
      {isLoaded ? (
        <BrowserRouter basename={config.baseUrl}>
          <ScrollToTop>
            <Switch>
              <Route exact path='/' component={HomePage} />
              <Route path='/products/:id' component={ProductGroupPage} />
              <Route path='/product/:id' component={ProductPage} />
              {
                // <Route path='/themes/:id' component={ThemesPage} />
              }
              <Route path='/cart' component={CartPage} />
              <Route path='/checkout' component={CheckoutPage} />
              {
                // <Route path='/artwork/:id' component={ArtworkPage} />
              }
              <Route path='/thankyou' component={ThanksPage} />
              <Route path='/designer/create-design/:id' component={DesignerPage} />
              <Route path='/designer/:id' component={DesignerPage} />
              <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={AuthorizationRoutes} />
              <Route component={NotFoundStub} />
            </Switch>
          </ScrollToTop>
        </BrowserRouter>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default App;
