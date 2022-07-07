import BaseElement from '../elements/BaseElement';
import designer from '../elements/Designer';
import BaseCommand from './BaseCommand';

export default class UseAsBackgroundCommand extends BaseCommand {
  public readonly name = 'Changed to background';

  private readonly _oldElement: BaseElement;
  private readonly _newBg: BaseElement;
  private readonly _oldBg: BaseElement;
  private readonly _page: number;
  private readonly _canvas: number;
  private _layer: number;

  public constructor(oldElement: BaseElement, newBg: BaseElement, oldBg: BaseElement) {
    super();
    this._oldElement = oldElement;
    this._newBg = newBg;
    this._oldBg = oldBg;
    this._page = designer.activePage;
    this._canvas = designer.activeCanvas;

    for (let i = 0; i < designer.pages[this._page].canvases.length; i++) {
      const layer = designer.pages[this._page].canvases[i].elements.findIndex(
        (element) => element.id === this._oldElement.id
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
  }

  public do(): Promise<void> {
    this._replace(this._newBg);
    designer.pages[this._page].canvases[this._canvas].elements.splice(this._layer, 1);

    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
    designer.setSelectedElements([this._newBg.id]);
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    this._replace(this._oldBg);
    designer.pages[this._page].canvases[this._canvas].elements.splice(this._layer, 0, this._oldElement);

    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
    return Promise.resolve();
  }
}
