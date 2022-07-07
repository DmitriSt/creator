import uniqid from 'uniqid';

import { ICanvas, IDimension } from '../interfaces/interfaces';
import ElementConverterToSVGVisitor from '../visitors/ElementConverterToSVGVisitor';
import BaseElement from './BaseElement';

export default class Canvas implements ICanvas {
  private readonly _id: string;
  private _name = '';
  private _canvasId: number | null = null;
  private _layoutId: string | null = null;
  private _top = 0;
  private _left = 0;
  private _bleed: IDimension = {
    width: 0,
    height: 0,
  };
  private _width = 0;
  private _height = 0;
  private _disabled = false;
  private _elements: BaseElement[] = [];

  public get bleed() {
    return this._bleed;
  }

  public get id(): string {
    return this._id;
  }

  public get canvasId() {
    return this._canvasId;
  }

  public get name(): string {
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get layoutId() {
    return this._layoutId;
  }

  public get top() {
    return this._top;
  }

  public set top(top: number) {
    this._top = top;
  }

  public get left() {
    return this._left;
  }

  public set left(left: number) {
    this._left = left;
  }

  public get disabled() {
    return this._disabled;
  }

  public set disabled(state: boolean) {
    this._disabled = state;
  }

  public get width(): number {
    return this._width;
  }

  public set width(width: number) {
    if (width > 0 && width < Infinity) {
      this._width = width;
    }
  }

  public get height(): number {
    return this._height;
  }

  public set height(height: number) {
    if (height > 0 && height < Infinity) {
      this._height = height;
    }
  }

  public get elements(): BaseElement[] {
    return this._elements;
  }

  public set elements(elements: BaseElement[]) {
    this._elements = elements;
  }

  public getSVG() {
    const visitor = new ElementConverterToSVGVisitor();
    const fontFamilyStyle = new Set<string>();
    const elementsBlob = this.elements.map((element) => {
      const result = element.visit<string | TextRes>(visitor);
      if (typeof result === 'string') {
        return result;
      }
      fontFamilyStyle.add(result.styles);
      return result.svgElement;
    });
    const content = elementsBlob.join('');
    const fontStyle = `&lt;style&gt;${Array.from(fontFamilyStyle.values()).join('')}&lt;/style&gt;`;
    const stableAttrs = `xmlns=&quot;http://www.w3.org/2000/svg&quot; preserveAspectRatio=&quot;xMinYMin meet&quot; ${
      this.width > this.height ? '' : 'height=&quot;100%&quot;'
    }`;
    return `&lt;svg ${stableAttrs} x=&quot;${this.left}&quot; y=&quot;${this.top}&quot; viewBox=&quot;0 0 ${this.width} ${this.height}&quot;&gt;${fontStyle}${content}&lt;/svg&gt;`;
  }

  static isElementExist = (canvas: Canvas, deleteElements: BaseElement[]) => {
    for (let i = 0; i < deleteElements.length; i++) {
      for (let k = 0; k < canvas.elements.length; k++) {
        if (deleteElements[i].id === canvas.elements[k].id) {
          return canvas.elements[k];
        }
      }
    }
    return false;
  };

  constructor(
    width: number,
    height: number,
    name: string,
    elements: BaseElement[],
    id: number,
    layoutId: string | null,
    left: number,
    top: number,
    bleed: IDimension,
    disabled = false
  ) {
    this._id = uniqid();
    this._canvasId = id;
    this.name = name;
    this._layoutId = layoutId;
    this.left = left;
    this.top = top;
    this._bleed = bleed;
    this.width = width;
    this.height = height;
    this.elements = elements;
    this.disabled = disabled;
  }
}

type TextRes = {
  styles: string;
  svgElement: string;
};
