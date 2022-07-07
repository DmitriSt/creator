import { ToolbarStateType } from '../../../../models/designer/toolbar.models';
import ActionTypesDesigner from '../actionTypes';
import { setStrongLayersShow, setToolbarShow } from './toolbarActions';

const defaultState: ToolbarStateType = {
  toolbarShow: true,
  strongLayersShow: false,
};

export type ToolbarActionType = ReturnType<typeof setToolbarShow> | ReturnType<typeof setStrongLayersShow>;

export function toolbarReducer(state = defaultState, action: ToolbarActionType) {
  switch (action.type) {
    case ActionTypesDesigner.SET_TOOLBAR_SHOW:
      return {
        ...state,
        toolbarShow: action.payload,
      };
    case ActionTypesDesigner.SET_STRONG_LAYERS_SHOW:
      return {
        ...state,
        strongLayersShow: action.payload,
      };
    default:
      return state;
  }
}
