import { defaultFlip } from '../../models/constants/defaults';
import { ElementFeatures } from '../../models/constants/designer';
import { ICroppable, IFlippable, IMovable, IRotatable, IWithColor, IWithImage } from '../interfaces/featuresInterfaces';
import { ICrop, IFlip } from '../interfaces/interfaces';
import { IVisitor } from '../visitors/visitorsInterfaces';
import BaseElement from './BaseElement';

export default class Sticker
  extends BaseElement
  implements IWithImage, IWithColor, IMovable, IFlippable, IRotatable, ICroppable {
  public readonly elementName = 'Clipart';
  public readonly features = [
    ElementFeatures.Movable,
    ElementFeatures.Flippable,
    ElementFeatures.Rotatable,
    ElementFeatures.Croppable,
    ElementFeatures.Colorable,
  ];

  protected readonly _minWidth = 20;
  protected readonly _minHeight = 20;

  private readonly _originalWidth: number;
  private readonly _originalHeight: number;

  private _source = '';
  private _url = '';
  private _mediumUrl = '';
  private _thumbUrl = '';
  private _rotation = 0;
  private _color = '';
  private _flip: IFlip = defaultFlip;
  private _crop: ICrop = {
    width: this.width,
    height: this.height,
    x: this.width / 2,
    y: this.height / 2,
  };

  public get source(): string {
    return this._source;
  }

  public set source(source: string) {
    this._source = source;
  }

  public get url(): string {
    return this._url;
  }

  public set url(url: string) {
    this._url = url;
  }

  public get mediumUrl(): string {
    return this._mediumUrl;
  }

  public set medium(mediumUrl: string) {
    this._mediumUrl = mediumUrl;
  }

  public get thumbUrl(): string {
    return this._thumbUrl;
  }

  public set thumbUrl(thumbUrl: string) {
    this._thumbUrl = thumbUrl;
  }

  public get originalWidth(): number {
    return this._originalWidth;
  }

  public get originalHeight() {
    return this._originalHeight;
  }

  public get rotation(): number {
    return this._rotation;
  }

  public set rotation(rotation: number) {
    this._rotation = rotation % 360;
  }

  public get color(): string {
    return this._color;
  }

  public set color(color: string) {
    this._color = color;
  }

  public get flip(): IFlip {
    return this._flip;
  }

  public set flip(flip: IFlip) {
    this._flip = flip;
  }

  public get crop(): ICrop {
    return this._crop;
  }

  public set crop(crop: ICrop) {
    if (crop.width <= this.originalWidth && crop.height <= this.originalHeight) {
      this._crop = crop;
    }
  }

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    originalWidth: number,
    originalHeight: number,
    source: string,
    thumbUrl: string,
    mediumUrl: string,
    url: string,
    color?: string,
    rotation?: number,
    flip?: IFlip,
    crop?: ICrop
  ) {
    super(x, y, width, height);
    this.source = source;
    this._thumbUrl = thumbUrl;
    this._mediumUrl = mediumUrl;
    this._url = url;
    this._originalWidth = originalWidth;
    this._originalHeight = originalHeight;
    if (color) {
      this.color = color;
    }
    if (rotation) {
      this.rotation = rotation;
    }
    if (flip) {
      this.flip = flip;
    }
    if (crop) {
      this.crop = crop;
    }
  }

  public visit<T>(visitor: IVisitor<T>): T {
    return visitor.visitSticker(this);
  }
}
