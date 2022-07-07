import { ActiveProductConfigType } from '../../../../models/artwork.models';
import ActionTypesCart from '../actionTypes';
import updateActiveProduct from './activeProductActions';

const defaultState: ActiveProductConfigType = {
  filters: null,
  id: null,
  price: null,
};

export type ArtworkActionType = ReturnType<typeof updateActiveProduct>;

export function activeProductReducer(state = defaultState, action: ArtworkActionType) {
  switch (action.type) {
    case ActionTypesCart.UPDATE_ACTIVE_PRODUCT:
      return action.payload;
    default:
      return state;
  }
}
