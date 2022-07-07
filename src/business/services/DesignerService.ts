import { getFullDesignerConfig } from '../../services/designer/designer.service';

export default async function getFullDesigner(productId: number) {
  const response = await getFullDesignerConfig(productId);
  return response;
}
