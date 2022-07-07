import { ThemesStateType } from '../../../../models/themes.models';
import resetState from '../../actions';
import GlobalActionTypes from '../../actionTypes';
import ActionTypes from '../actionTypes';
import {
  initThemesCards,
  setActiveTheme,
  setActiveThemeSide,
  setThemesSides,
  updateThemesCards,
} from './themesActions';

export type ThemesActionType =
  | ReturnType<typeof setActiveTheme>
  | ReturnType<typeof setThemesSides>
  | ReturnType<typeof setActiveThemeSide>
  | ReturnType<typeof resetState>
  | ReturnType<typeof updateThemesCards>
  | ReturnType<typeof initThemesCards>;

const defaultState: ThemesStateType = {
  activeTheme: null,
  themeSides: [],
  activeThemeSide: null,
};

export function themesReducer(state = defaultState, action: ThemesActionType) {
  switch (action.type) {
    case ActionTypes.INIT_THEMES_CARDS:
      return {
        ...state,
        themes: action.payload || [],
      };
    case ActionTypes.UPDATE_THEMES_CARDS:
      return {
        ...state,
        themes: [...state.themes, ...action.payload],
      };
    case ActionTypes.SET_ACTIVE_THEME:
      return {
        ...state,
        activeTheme: action.payload,
      };
    case ActionTypes.SET_THEMES_SIDES:
      return {
        ...state,
        themeSides: action.payload,
      };
    case ActionTypes.SET_ACTIVE_THEME_SIDE:
      return {
        ...state,
        activeThemeSide: action.payload,
      };
    case GlobalActionTypes.RESET_STATE:
      return defaultState;
    default:
      return state;
  }
}
