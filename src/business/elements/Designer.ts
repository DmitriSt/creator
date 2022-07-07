import BaseElement from './BaseElement';
import Canvas from './Canvas';
import Page from './Page';

export class Designer {
  private _productId = 0;
  private _designId = '';
  private _projectName = '';
  private _templateId = '';
  private _layoutId = '';
  private _pages: Page[] = [];
  private _selectedElements: BaseElement[] = [];
  private _activePage = 0;
  private _activeCanvas = 0;
  private _isLayers = false;
  private _overlapElements: BaseElement[] = [];

  public get productId() {
    return this._productId;
  }

  public set productId(productId: number) {
    this._productId = productId;
  }

  public get designId() {
    return this._designId;
  }

  public set designId(designId: string) {
    this._designId = designId;
  }

  public get projectName() {
    return this._projectName;
  }

  public set projectName(projectName: string) {
    this._projectName = projectName;
  }

  public get templateId() {
    return this._templateId;
  }

  public set templateId(templateId: string) {
    this._templateId = templateId;
  }

  public get layoutId() {
    return this._layoutId;
  }

  public set layoutId(layoutId: string) {
    this._layoutId = layoutId;
  }

  public get pages() {
    return this._pages;
  }

  public set pages(pages: Page[]) {
    this._pages = pages;
  }

  public get selectedElements() {
    return this._selectedElements;
  }

  public setSelectedElements(elementsIds: string[]) {
    this._selectedElements = this._pages[this._activePage].canvases[this._activeCanvas].elements.filter((element) =>
      elementsIds.includes(element.id)
    );
  }

  public addToSelectedElements(elementsIds: string[]) {
    const elements = this._pages[this._activePage].canvases[this._activeCanvas].elements.filter((element) =>
      elementsIds.includes(element.id)
    );
    this._selectedElements.push(...elements);
  }

  public removeFromSelectedElements(elementsIds: string[]) {
    this._selectedElements = this._selectedElements.filter((element) => !elementsIds.includes(element.id));
  }

  public clearSelectedElements() {
    this._selectedElements = [];
  }

  public get activeCanvas() {
    return this._activeCanvas;
  }

  public set activeCanvas(index: number) {
    if (index < 0 || index >= this._pages[this._activePage].canvases.length) {
      throw new Error(`Number not inside [0...${this._pages[this._activePage].canvases.length - 1}]`);
    }
    if (index !== this._activeCanvas) {
      this._activeCanvas = index;
      this._selectedElements = [];
    }
  }

  public get activePage() {
    return this._activePage;
  }

  public set activePage(index: number) {
    if (index < 0 || index >= this._pages.length) {
      throw new Error(`Number not inside [0...${this._pages.length - 1}]`);
    }
    if (index !== this._activePage) {
      this._activePage = index;
      this._selectedElements = [];
    }
  }

  public get isLayers() {
    return this._isLayers;
  }

  public set isLayers(flag: boolean) {
    this._isLayers = flag;
  }

  public get overlapElements() {
    return this._overlapElements;
  }

  public set overlapElements(overlapElements: BaseElement[]) {
    this._overlapElements = overlapElements;
  }

  public getCurrentPage() {
    return this._pages[this._activePage];
  }

  public getCurrentCanvas() {
    return this._pages[this._activePage]?.canvases[this._activeCanvas];
  }

  public getAllCanvases() {
    const canvases: Canvas[] = [];
    for (let i = 0; i < this._pages.length; i++) {
      canvases.push(...this._pages[i].canvases);
    }
    return canvases;
  }

  public getElementById(id: string) {
    for (let i = 0; i < this._pages.length; i++) {
      for (let k = 0; k < this._pages[i].canvases.length; k++) {
        const element = this._pages[i].canvases[k].elements.find((element) => element.id === id);
        if (element) return element;
      }
    }
    return null;
  }
}

const designer = new Designer();

export default designer;
