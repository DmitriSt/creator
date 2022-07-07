import { ArtwokrPageConfigType } from '../../../../models/artwork.models';
import ActionTypes from '../actionTypes';

export default function initArtworkPageStore(config: ArtwokrPageConfigType) {
  return {
    type: ActionTypes.INIT_ARTWORK_PAGE_SETUP,
    payload: config,
  } as const;
}
