import { DesignerProductConfig } from '../../../../models/designer/designer.models';
import ActionTypesDesigner from '../actionTypes';

export default function setProduct(product: DesignerProductConfig | null) {
  return {
    type: ActionTypesDesigner.SET_PRODUCT,
    payload: product,
  } as const;
}
