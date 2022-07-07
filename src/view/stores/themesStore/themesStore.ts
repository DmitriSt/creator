import { combineReducers } from 'redux';

import { searchReducer } from './search/searchReducers';
import { themesReducer } from './themes/themesReducers';
import { themesPageReducer } from './themesPage/themesPageReducers';

const themesRootReducer = combineReducers({
  search: searchReducer,
  themes: themesReducer,
  themesPage: themesPageReducer,
});

export default themesRootReducer;

export type CartStateType = ReturnType<typeof themesRootReducer>;
