import { combineReducers } from 'redux';

import { cartReducer } from './cart/cartReducers';
import { cartPageReducer } from './cartPage/cartPageReducers';

const cartRootReducer = combineReducers({
  cart: cartReducer,
  cartPage: cartPageReducer,
});

export default cartRootReducer;

export type CartStateType = ReturnType<typeof cartRootReducer>;
