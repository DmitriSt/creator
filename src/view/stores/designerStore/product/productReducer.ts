import { DesignerProductStateType } from '../../../../models/designer/designer.models';
import ActionTypesDesigner from '../actionTypes';
import setProduct from './productActions';

const defaultState: DesignerProductStateType = {
  backgroundSelector: null,
  colors: null,
  description: null,
  fonts: null,
  name: null,
  pages: null,
  productId: null,
  size: null,
  sku: null,
  supportedDesigners: null,
  type: null,
};

export type ToolbarActionType = ReturnType<typeof setProduct>;

export function productReducer(state = defaultState, action: ToolbarActionType) {
  switch (action.type) {
    case ActionTypesDesigner.SET_PRODUCT:
      return action.payload;
    default:
      return state;
  }
}
