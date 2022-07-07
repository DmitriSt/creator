import cloneDeep from 'lodash.clonedeep';

import BaseElement from '../elements/BaseElement';
import designer from '../elements/Designer';
import BaseCommand from './BaseCommand';

export default class AddCommand extends BaseCommand {
  public readonly name = 'Add new element';

  private readonly _element: BaseElement;
  private readonly _page: number;
  private readonly _canvas: number;
  private _layer: number;

  public constructor(element: BaseElement) {
    super();
    this._element = element;
    this._page = designer.activePage;
    this._canvas = designer.activeCanvas;
  }

  public do(): Promise<void> {
    if (this._layer === undefined) {
      designer.getCurrentCanvas().elements.push(cloneDeep(this._element));
    } else {
      designer.pages[this._page].canvases[this._canvas].elements.splice(this._layer, 0, this._element);
      designer.activeCanvas = this._canvas;
    }
    designer.setSelectedElements([this._element.id]);
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    const canvases = designer.getAllCanvases();
    for (let i = 0; i < canvases.length; i++) {
      const layer = canvases[i].elements.findIndex((element) => element.id === this._element.id);
      if (layer !== -1) {
        this._layer = layer;
        canvases[i].elements.splice(this._layer, 1);
        designer.activePage = this._page;
        designer.activeCanvas = this._canvas;
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
