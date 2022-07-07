import { IHomePageInfoType } from '../../../models/homePage.models';
import ActionTypes from '../actionTypes';

function initHomePageStore(config: IHomePageInfoType) {
  return {
    type: ActionTypes.INIT_HOMEPAGE_STORE,
    payload: config,
  } as const;
}

export default initHomePageStore;
