import ActionTypesDesigner from '../actionTypes';

export function setToolbarShow(flag: boolean) {
  return {
    type: ActionTypesDesigner.SET_TOOLBAR_SHOW,
    payload: flag,
  } as const;
}

export function setStrongLayersShow(flag: boolean) {
  return {
    type: ActionTypesDesigner.SET_STRONG_LAYERS_SHOW,
    payload: flag,
  } as const;
}
