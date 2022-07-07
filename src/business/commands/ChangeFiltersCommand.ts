import BaseElement from '../elements/BaseElement';
import designer from '../elements/Designer';
import { IWithFilters, IWithFiltersProperties } from '../interfaces/featuresInterfaces';
import BaseCommand from './BaseCommand';

export default class ChangeFiltersCommand extends BaseCommand {
  public readonly name = 'Move element';

  private readonly _elementId: string;
  private readonly _layer: number;
  private readonly _page: number;
  private readonly _canvas: number;
  private readonly _prev: IWithFiltersProperties;
  private readonly _next: IWithFiltersProperties;

  public constructor(prev: IWithFiltersProperties, next: IWithFiltersProperties, elementId: string) {
    super();
    this._prev = { ...prev };
    this._next = { ...next };
    this._elementId = elementId;
    this._page = designer.activePage;

    for (let i = 0; i < designer.pages[this._page].canvases.length; i++) {
      const layer = designer.pages[this._page].canvases[i].elements.findIndex(
        (element) => element.id === this._elementId
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
    this._change(this._next);
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    this._change(this._prev);
    return Promise.resolve();
  }

  private _change(filters: IWithFiltersProperties) {
    (designer.pages[this._page].canvases[this._canvas].elements[this._layer] as BaseElement & IWithFilters).filters = {
      ...filters,
    };

    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
  }
}
