import { ThemesPageStateType } from '../../../../models/themesPage.models';
import resetStoreState from '../../actions';
import CommonActionTypes from '../../actionTypes';
import ActionTypes from '../actionTypes';
import initThemesPageStore from './themesPageActions';

export type ThemesPageActionType = ReturnType<typeof initThemesPageStore> | ReturnType<typeof resetStoreState>;

const defaultState: ThemesPageStateType = {
  isLoaded: false,
  pageAlert: null,
  pageConfig: null,
  footer: null,
  filtersConfig: null,
};

export function themesPageReducer(state = defaultState, action: ThemesPageActionType) {
  switch (action.type) {
    case ActionTypes.INIT_THEMES_PAGE_STORE:
      return {
        ...state,
        ...action.payload,
        isLoaded: true,
        filtersConfig: {
          filters: action.payload.filtersConfig.filter((item) => item.text !== 'Sort' && item.text !== 'Search'),
          sort: action.payload.filtersConfig.find((item) => item.text === 'Sort') || null,
          search: action.payload.filtersConfig.find((item) => item.text === 'Search') || null,
        },
      };
    case CommonActionTypes.RESET_STATE:
      return defaultState;
    default:
      return state;
  }
}
