import { ElementFeatures } from '../../models/constants/designer';
import { IWithColor } from '../interfaces/featuresInterfaces';
import { IVisitor } from '../visitors/visitorsInterfaces';
import BaseElement from './BaseElement';

export default class BackgroundColor extends BaseElement implements IWithColor {
  public readonly elementName = 'Background';

  public readonly features: ElementFeatures[] = [ElementFeatures.Colorable];

  private _color = '#ffffff';

  public get color(): string {
    return this._color;
  }

  public set color(color: string) {
    this._color = color;
  }

  constructor(x: number, y: number, width: number, height: number, color?: string) {
    super(x, y, width, height);
    if (color) {
      this.color = color;
    }
  }

  public visit<T>(visitor: IVisitor<T>): T {
    return visitor.visitBackgroundColor(this);
  }
}
