import BaseElement from '../elements/BaseElement';
import designer from '../elements/Designer';
import BaseCommand from './BaseCommand';

export default class DeleteCommand extends BaseCommand {
  public readonly name = 'Delete element';

  private readonly _elements: BaseElement[];
  private readonly _layers: number[];
  private readonly _page: number;
  private readonly _canvas: number;

  public constructor(elements: BaseElement[]) {
    super();
    this._elements = elements;
    this._page = designer.activePage;
    this._canvas = designer.activeCanvas;

    for (let i = 0; i < designer.pages[this._page].canvases.length; i++) {
      const layers = this._elements.map((elementToDelete) => {
        return designer.pages[this._page].canvases[i].elements.findIndex(
          (element) => element.id === elementToDelete.id
        );
      });
      if (!layers.includes(-1)) {
        this._layers = layers;
        this._canvas = i;
        break;
      }
    }
    if (this._layers === undefined) {
      throw new Error('Element not found');
    }
  }

  public do(): Promise<void> {
    this._layers.forEach((layer) => {
      designer.pages[this._page].canvases[this._canvas].elements.splice(layer, 1);
    });
    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
    designer.clearSelectedElements();
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    this._layers.forEach((layer, index) => {
      designer.pages[this._page].canvases[this._canvas].elements.splice(layer, 0, this._elements[index]);
    });
    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
    designer.setSelectedElements(this._elements.map((element) => element.id));
    return Promise.resolve();
  }
}
