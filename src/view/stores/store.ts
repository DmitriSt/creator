import { combineReducers } from 'redux';

import { appReducer } from './appStore/appReducers';
import artworkRootReducer from './artworkPageStore/artworkStore';
import cartReducer from './cartStore/cartStore';
import checkoutReducer from './checkoutStore/checkoutStore';
import { commonDataReducer } from './commonStore/commonReducers';
import designerRootReducer from './designerStore/designerStore';
import { homePageReducer } from './homePageStore/homePageReducers';
import { productGroupPageReducer } from './productGroupPageStore/productGroupPageReducers';
import { productPageReducer } from './productPageStore/productPageReducers';
import themesReducer from './themesStore/themesStore';

const rootReducer = combineReducers({
  appState: appReducer,
  commonState: commonDataReducer,
  checkoutState: checkoutReducer,
  cartState: cartReducer,
  homePageState: homePageReducer,
  productGroupPageState: productGroupPageReducer,
  productPageState: productPageReducer,
  artworkState: artworkRootReducer,
  themesState: themesReducer,
  designerState: designerRootReducer,
});

export default rootReducer;

export type RootStateType = ReturnType<typeof rootReducer>;
