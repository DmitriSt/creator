import BaseElement from '../elements/BaseElement';
import designer from '../elements/Designer';
import BaseCommand from './BaseCommand';

export default class UseAsImageCommand extends BaseCommand {
  public readonly name = 'Changed to image';

  private readonly _oldBgElement: BaseElement;
  private readonly _newBgElement: BaseElement;
  private readonly _newImageElement: BaseElement;
  private readonly _page: number;
  private readonly _canvas: number;
  private _layer: number;

  public constructor(oldBgElement: BaseElement, newBgElement: BaseElement, newImageElement: BaseElement) {
    super();
    this._oldBgElement = oldBgElement;
    this._newBgElement = newBgElement;
    this._newImageElement = newImageElement;
    this._page = designer.activePage;
    this._canvas = designer.activeCanvas;

    for (let i = 0; i < designer.pages[this._page].canvases.length; i++) {
      const layer = designer.pages[this._page].canvases[i].elements.findIndex(
        (element) => element.id === this._oldBgElement.id
      );
      if (layer !== -1) {
        this._canvas = i;
        this._layer = layer;
        break;
      }
    }
    if (this._layer === undefined) {
      throw new Error('Element not found');
    }
  }

  private _replace(element: BaseElement) {
    designer.pages[this._page].canvases[this._canvas].elements.splice(0, 1, element);

    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
  }

  public do(): Promise<void> {
    this._replace(this._newBgElement);
    designer.getCurrentCanvas().elements.push(this._newImageElement);

    designer.setSelectedElements([this._newImageElement.id]);
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    this._replace(this._oldBgElement);
    for (let i = 0; i < designer.pages[this._page].canvases.length; i++) {
      const layer = designer.pages[this._page].canvases[i].elements.findIndex(
        (element) => element.id === this._newImageElement.id
      );
      if (layer !== -1) {
        this._layer = layer;
        designer.pages[this._page].canvases[this._canvas].elements.splice(this._layer, 1);

        designer.clearSelectedElements();
        break;
      }
    }
    if (this._layer === undefined) {
      throw new Error('Element not found');
    }
    return Promise.resolve();
  }
}
