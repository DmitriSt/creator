import { AppStateType } from '../../../models/app.models';
import ActionTypes from '../actionTypes';
import { initAppStore, updateSupportScripts, updateTestimonials } from './appActions';

const defaultState: AppStateType = {
  isLoaded: false,
  config: {
    brandingLogo: '',
    brandingText: '',
    copyrightNotice: '',
    campaignConfig: null,
    customerServiceInfo: null,
    measurementUnits: null,
    message: '',
    siteId: null,
    supportToolsScript: null,
    typography: null,
    uiCulture: '',
    waterarkText: '',
  },
  testimonials: null,
};

export type AppActionType =
  | ReturnType<typeof initAppStore>
  | ReturnType<typeof updateTestimonials>
  | ReturnType<typeof updateSupportScripts>;

export function appReducer(state = defaultState, action: AppActionType) {
  switch (action.type) {
    case ActionTypes.INIT_APP_STORE:
      return {
        ...state,
        isLoaded: true,
        config: {
          ...state.config,
          ...action.payload,
        },
      };
    case ActionTypes.UPDATE_SUPPORT_SCRIPTS:
      return {
        ...state,
        config: {
          ...state.config,
          supportToolsScript: action.payload,
        },
      };
    case ActionTypes.UPDATE_TESTIMONIALS:
      return {
        ...state,
        testimonials: action.payload,
      };
    default:
      return state;
  }
}
