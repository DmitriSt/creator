import { combineReducers } from 'redux';

import { designerReducer } from './designer/designerReducers';
import { productReducer } from './product/productReducer';
import { tabBarReducer } from './tabBar/tabBarReducers';
import { toolbarReducer } from './toolbar/toolbarReducer';

const designerRootReducer = combineReducers({
  designer: designerReducer,
  tabBar: tabBarReducer,
  toolbar: toolbarReducer,
  product: productReducer,
});

export default designerRootReducer;

export type RootStateType = ReturnType<typeof designerRootReducer>;
