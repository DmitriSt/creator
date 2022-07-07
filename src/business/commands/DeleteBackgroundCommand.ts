import BackgroundColor from '../elements/BackgroundColor';
import BaseElement from '../elements/BaseElement';
import designer from '../elements/Designer';
import BaseCommand from './BaseCommand';

export default class DeleteBackgroundCommand extends BaseCommand {
  public readonly name = 'Delete background';

  private readonly _element: BaseElement;
  private readonly _page: number;
  private readonly _canvas: number;

  public constructor(element: BaseElement) {
    super();
    this._element = element;
    this._page = designer.activePage;
    this._canvas = designer.activeCanvas;
  }

  public do(): Promise<void> {
    const emptyBackground = new BackgroundColor(
      this._element.x,
      this._element.y,
      this._element.width,
      this._element.height,
      '#FFFFFF'
    );
    designer.pages[this._page].canvases[this._canvas].elements.splice(0, 1, emptyBackground);
    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
    designer.clearSelectedElements();
    return Promise.resolve();
  }

  public undo(): Promise<void> {
    designer.pages[this._page].canvases[this._canvas].elements.splice(0, 1, this._element);
    designer.activePage = this._page;
    designer.activeCanvas = this._canvas;
    designer.setSelectedElements([this._element.id]);
    return Promise.resolve();
  }
}
