import { IBaseObj } from '../../../../models/commonPage.models';
import { SearchUpdate, ThemeSearchStateType } from '../../../../models/themes.models';
import resetState from '../../actions';
import GlobalActionTypes from '../../actionTypes';
import ActionTypes from '../actionTypes';
import { updateSearch, updateSearchResults } from './searchActions';

export type ThemesActionType =
  | ReturnType<typeof updateSearch>
  | ReturnType<typeof resetState>
  | ReturnType<typeof updateSearchResults>;

const defaultState: ThemeSearchStateType = {
  search: null,
  results: 0,
};

function generateSearchMap(newAttr: SearchUpdate, state: IBaseObj | null) {
  const { key, value } = newAttr;
  if (value) {
    return state ? { ...state, [key]: value } : { [key]: value };
  }
  if (state) {
    return Object.fromEntries(Object.entries(state).filter((item) => item[0] !== key));
  }
  return state;
}

export function searchReducer(state = defaultState, action: ThemesActionType) {
  switch (action.type) {
    case ActionTypes.UPDATE_SEARCH:
      return {
        ...state,
        search: generateSearchMap(action.payload, state.search),
      };
    case ActionTypes.UPDATE_SEARCH_RESULTS:
      return {
        ...state,
        results: action.payload,
      };
    case GlobalActionTypes.RESET_STATE:
      return defaultState;
    default:
      return state;
  }
}
