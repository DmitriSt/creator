import designer, { Designer } from '../elements/Designer';
import { IDesignerConfig } from '../interfaces/configsInterfaces';
import createPage from './configToPagesFactory';

export default function createDesigner(config: IDesignerConfig): Designer {
  if (config.pages === null || config.pages.length === 0) {
    throw new Error('Pages is required');
  }
  designer.productId = config.productId;
  designer.designId = config.designId;
  designer.projectName = config.projectName;
  designer.templateId = config.templateId;
  designer.layoutId = config.layoutId;
  designer.pages = config.pages.map((page) => createPage(page));
  return designer;
}
