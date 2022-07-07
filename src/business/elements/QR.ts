import { ElementFeatures } from '../../models/constants/designer';
import { FormatTypes } from '../../models/designer/qr.models';
import { IMovable, IRotatable, IWithColor } from '../interfaces/featuresInterfaces';
import BaseElement from './BaseElement';

export default abstract class QR<T = unknown> extends BaseElement implements IWithColor, IMovable, IRotatable {
  public readonly features = [ElementFeatures.Movable, ElementFeatures.Rotatable, ElementFeatures.Colorable];

  protected abstract readonly initialValue: unknown;

  protected readonly _minWidth = 20;
  protected readonly _minHeight = 20;

  private _value: T;
  private _format: FormatTypes = FormatTypes.Text;
  private _color = '#000000';
  private _rotation = 0;

  public get value(): T {
    return this._value;
  }

  public set value(value: T) {
    this._value = value;
  }

  public get format(): FormatTypes {
    return this._format;
  }

  public set format(format: FormatTypes) {
    this._format = format;
  }

  public get color(): string {
    return this._color;
  }

  public set color(color: string) {
    this._color = color;
  }

  public get rotation(): number {
    return this._rotation;
  }

  public set rotation(rotation: number) {
    this._rotation = rotation % 360;
  }

  protected constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    value: T,
    format: FormatTypes,
    color?: string,
    rotation?: number
  ) {
    super(x, y, width, height);
    this.value = value;
    this.format = format;
    if (color) {
      this.color = color;
    }
    if (rotation) {
      this.rotation = rotation;
    }
  }
}
