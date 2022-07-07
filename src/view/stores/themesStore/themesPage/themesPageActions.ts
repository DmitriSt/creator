import { ThemesPageConfigType } from '../../../../models/themesPage.models';
import ActionTypes from '../actionTypes';

function initThemesPageStore(config: ThemesPageConfigType) {
  return {
    type: ActionTypes.INIT_THEMES_PAGE_STORE,
    payload: config,
  } as const;
}

export default initThemesPageStore;
