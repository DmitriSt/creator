import Canvas from '../elements/Canvas';
import { Designer } from '../elements/Designer';
import Page from '../elements/Page';
import { ICanvasConfig, IDesignerConfig, IPageConfig } from '../interfaces/configsInterfaces';
import ElementConverterVisitor from '../visitors/ElementConverterVisitor';

export function createCanvasConfig(canvas: Canvas): ICanvasConfig {
  const visitor = new ElementConverterVisitor();
  return {
    width: canvas.width,
    height: canvas.height,
    name: canvas.name,
    id: canvas.canvasId,
    bleed: canvas.bleed,
    layoutId: canvas.layoutId,
    left: canvas.left,
    top: canvas.top,
    items: canvas.elements.map((element) => element.visit(visitor)),
  };
}

function createPageConfig(page: Page): IPageConfig {
  return {
    name: page.name,
    width: page.width,
    height: page.height,
    id: page.id,
    backgroundUrl: page.backgroundUrl,
    overlayUrl: page.overlayUrl,
    canvases: page.canvases.filter((canvas) => !canvas.disabled).map((canvas) => createCanvasConfig(canvas)),
  };
}

export default function createDesignerConfig(designer: Designer): IDesignerConfig {
  return {
    productId: designer.productId,
    designId: designer.designId,
    projectName: designer.projectName,
    templateId: designer.templateId,
    layoutId: designer.layoutId,
    pages: designer.pages.map((page) => createPageConfig(page)),
  };
}
