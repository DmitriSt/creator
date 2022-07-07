import { useLocation, useParams } from 'react-router';

import { ParamsType } from '../../models/commonPage.models';

export default function useDesignerURL(): [string, number] {
  const { pathname } = useLocation();
  const { id } = useParams<ParamsType>();
  const isNumber = typeof +id === 'number' && !Number.isNaN(+id);
  const productId = pathname.includes('/designer/create-design') && isNumber ? +id : 0;
  const designId = productId === 0 ? id : '';
  return [designId, productId];
}
