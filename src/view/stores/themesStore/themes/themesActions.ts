import { ThemeCardSideType, ThemeCardType } from '../../../../models/themes.models';
import ActionTypes from '../actionTypes';

export function initThemesCards(themes: ThemeCardType[]) {
  return {
    type: ActionTypes.INIT_THEMES_CARDS,
    payload: themes,
  } as const;
}

export function updateThemesCards(themes: ThemeCardType[]) {
  return {
    type: ActionTypes.UPDATE_THEMES_CARDS,
    payload: themes,
  } as const;
}

export function setActiveTheme(theme: ThemeCardType | null) {
  return {
    type: ActionTypes.SET_ACTIVE_THEME,
    payload: theme,
  } as const;
}

export function setThemesSides(sides: ThemeCardSideType[]) {
  return {
    type: ActionTypes.SET_THEMES_SIDES,
    payload: sides,
  } as const;
}

export function setActiveThemeSide(side: ThemeCardSideType) {
  return {
    type: ActionTypes.SET_ACTIVE_THEME_SIDE,
    payload: side,
  } as const;
}
