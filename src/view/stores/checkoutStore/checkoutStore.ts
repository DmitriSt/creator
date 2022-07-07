import { combineReducers } from 'redux';

import { checkoutReducer } from './checkout/checkoutReducers';
import { userReducer } from './user/userReducers';

const checkoutRootReducer = combineReducers({
  user: userReducer,
  checkout: checkoutReducer,
});

export default checkoutRootReducer;

export type CheckoutStateType = ReturnType<typeof checkoutRootReducer>;
