import { HomePageComponents, HomePageStateType } from '../../../models/homePage.models';
import resetStoreState from '../actions';
import ActionTypes from '../actionTypes';
import initHomePageStore from './homePageActions';

export type HomePageActionType = ReturnType<typeof initHomePageStore> | ReturnType<typeof resetStoreState>;

const defaultState: HomePageStateType = {
  isLoaded: false,
  order: [],
  pageAlert: null,
  pageConfig: null,
  bestOffers: null,
  userPicks: null,
  recommended: null,
  specials: null,
  products: null,
  footer: null,
};

export function homePageReducer(state = defaultState, action: HomePageActionType) {
  switch (action.type) {
    case ActionTypes.INIT_HOMEPAGE_STORE:
      return {
        ...state,
        order: Object.keys(action.payload) as HomePageComponents[],
        ...action.payload,
        isLoaded: true,
      };
    case ActionTypes.RESET_STATE:
      return defaultState;
    default:
      return state;
  }
}
