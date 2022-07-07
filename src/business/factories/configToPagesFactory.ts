import Page from '../elements/Page';
import { IPageConfig } from '../interfaces/configsInterfaces';
import { IPageDimension } from '../interfaces/interfaces';
import createCanvas from './configToCanvasFactory';

export default function createPage(page: IPageConfig): Page {
  const dimension: IPageDimension = {
    name: page.name,
    width: page.width,
    height: page.height,
    backgroundUrl: page.backgroundUrl,
    overlayUrl: page.overlayUrl,
    id: page.id,
  };
  const canvases = page.canvases.map((canvas) => createCanvas(canvas));
  return new Page(
    dimension.name,
    dimension.width,
    dimension.height,
    dimension.backgroundUrl,
    dimension.overlayUrl,
    dimension.id,
    canvases
  );
}
