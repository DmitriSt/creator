import { combineReducers } from 'redux';

import { activeProductReducer } from './activeProduct/activeProductReducers';
import { artworkPageReducer } from './artworkPageStore/artworkPageReducers';

const artworkRootReducer = combineReducers({
  artworkPageState: artworkPageReducer,
  activeProduct: activeProductReducer,
});

export default artworkRootReducer;

export type ArtworkStateType = ReturnType<typeof artworkRootReducer>;
