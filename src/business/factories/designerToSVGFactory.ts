import { SVGPageDTO } from '../../models/designer/designer.models';
import { Designer } from '../elements/Designer';

export default async function createSVGFromDesigner(designer: Designer): Promise<SVGPageDTO[]> {
  return designer.pages.map((page) => page.getSVG());
}
