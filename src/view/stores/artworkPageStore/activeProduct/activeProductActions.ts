import { ActiveProductDTO } from '../../../../models/artwork.models';
import ActionTypes from '../actionTypes';

function updateActiveProduct(config: ActiveProductDTO | null) {
  return {
    type: ActionTypes.UPDATE_ACTIVE_PRODUCT,
    payload: config,
  } as const;
}

export default updateActiveProduct;
