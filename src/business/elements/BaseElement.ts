import uniqid from 'uniqid';

import { ElementFeatures } from '../../models/constants/designer';
import { between } from '../../view/helpers/utils';
import { IElement } from '../interfaces/interfaces';
import { IVisitor, IWithVisitor } from '../visitors/visitorsInterfaces';

export default abstract class BaseElement implements IElement, IWithVisitor {
  public abstract elementName: string;
  public abstract readonly features: ElementFeatures[];
  private readonly _id: string;

  private _x = 0;
  private _y = 0;
  private _width = 0;
  private _height = 0;

  protected _minWidth = 0;
  protected _maxWidth = Infinity;
  protected _minHeight = 0;
  protected _maxHeight = Infinity;

  public get id(): string {
    return this._id;
  }

  public get minWidth(): number {
    return this._minWidth;
  }

  public get maxWidth(): number {
    return this._maxWidth;
  }

  public get minHeight(): number {
    return this._minHeight;
  }

  public get maxHeight(): number {
    return this._maxHeight;
  }

  public get bounds(): IElement {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  public set bounds(bounds: IElement) {
    if (bounds) {
      this.x = bounds.x;
      this.y = bounds.y;
      this.width = bounds.width;
      this.height = bounds.height;
    }
  }

  public get x(): number {
    return this._x;
  }

  public set x(x: number) {
    this._x = x;
  }

  public get y(): number {
    return this._y;
  }

  public set y(y: number) {
    this._y = y;
  }

  public get width(): number {
    return this._width;
  }

  public set width(width: number) {
    this._width = between(width, this._minWidth, this._maxWidth);
  }

  public get height(): number {
    return this._height;
  }

  public set height(height: number) {
    this._height = between(height, this._minHeight, this._maxHeight);
  }

  protected constructor(x: number, y: number, width: number, height: number) {
    this._id = uniqid();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public canWidthResize(size: number): boolean {
    return size >= this._minWidth && size <= this._maxWidth;
  }

  public canHeightResize(size: number): boolean {
    return size >= this._minHeight && size <= this._maxHeight;
  }

  public abstract visit<T>(visitor: IVisitor<T>): T;
}
