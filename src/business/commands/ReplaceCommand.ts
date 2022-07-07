import BaseElement from '../elements/BaseElement';
import designer from '../elements/Designer';
import BaseCommand from './BaseCommand';

export default class ReplaceCommand extends BaseCommand {
  public readonly name = 'Replace element';

  private readonly _oldElement: BaseElement;
  private readonly _newElement: BaseElement;
  private readonly _layer: number;
  private readonly _page: number;
  private readonly _canvas: number;

  public constructor(oldElement: BaseElement, newElement: BaseElement) {
    super();
    this._oldElement = oldElement;
    this._newElement = newElement;
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

  public do(): Promise<void> {
    this._replace(this._newElement);
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    this._replace(this._oldElement);
    return Promise.resolve();
  }

  private _replace(element: BaseElement) {
    designer.pages[this._page].canvases[this._canvas].elements.splice(this._layer, 1, element);
    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
    designer.setSelectedElements([element.id]);
  }
}
