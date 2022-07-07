import { defaultBorder, defaultFilters, defaultFlip } from '../../models/constants/defaults';
import { ElementFeatures } from '../../models/constants/designer';
import {
  ICroppable,
  IFlippable,
  IMovable,
  IRotatable,
  IWithFilters,
  IWithFiltersProperties,
  IWithImage,
} from '../interfaces/featuresInterfaces';
import { IBorder, ICrop, IFlip } from '../interfaces/interfaces';
import { IVisitor } from '../visitors/visitorsInterfaces';
import BaseElement from './BaseElement';

export default class Image
  extends BaseElement
  implements IWithImage, IWithFilters, IMovable, IFlippable, IRotatable, ICroppable {
  public readonly elementName = 'Image';

  public readonly features = [
    ElementFeatures.Movable,
    ElementFeatures.Flippable,
    ElementFeatures.Rotatable,
    ElementFeatures.Croppable,
    ElementFeatures.Filterable,
    ElementFeatures.UsableAsBackground,
  ];

  private readonly _originalWidth: number;
  private readonly _originalHeight: number;

  protected readonly _minWidth = 20;
  protected readonly _minHeight = 20;

  private _source = '';
  private _url = '';
  private _mediumUrl = '';
  private _thumbUrl = '';
  private _placeholder = false;
  private _border: IBorder = defaultBorder;
  private _rotation = 0;
  private _flip: IFlip = defaultFlip;
  private _crop: ICrop = {
    width: this.width,
    height: this.height,
    x: this.width / 2,
    y: this.height / 2,
  };
  private _filters: IWithFiltersProperties = defaultFilters;

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

  public set mediumUrl(mediumUrl: string) {
    this._mediumUrl = mediumUrl;
  }

  public get thumbUrl(): string {
    return this._thumbUrl;
  }

  public set thumbUrl(thumbUrl: string) {
    this._thumbUrl = thumbUrl;
  }

  public get placeholder(): boolean {
    return this._placeholder;
  }

  public set placeholder(placeholder: boolean) {
    this._placeholder = placeholder;
  }

  public get originalWidth(): number {
    return this._originalWidth;
  }

  public get originalHeight() {
    return this._originalHeight;
  }

  public get filters(): IWithFiltersProperties {
    return this._filters;
  }

  public set filters(filters: IWithFiltersProperties) {
    this._filters = filters;
  }

  public get border(): IBorder {
    return this._border;
  }

  public set border(border: IBorder) {
    if (border.width >= 0 && border.width < Infinity && border.radius >= 0 && border.radius <= border.width / 2) {
      this._border = border;
    }
  }

  public get rotation(): number {
    return this._rotation;
  }

  public set rotation(rotation: number) {
    this._rotation = rotation % 360;
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
    rotation?: number,
    flip?: IFlip,
    crop?: ICrop,
    filters?: IWithFiltersProperties,
    placeholder?: boolean
  ) {
    super(x, y, width, height);
    this.source = source;
    this._thumbUrl = thumbUrl;
    this._mediumUrl = mediumUrl;
    this._url = url;
    this._originalWidth = originalWidth;
    this._originalHeight = originalHeight;
    this._placeholder = placeholder || false;
    if (rotation) {
      this.rotation = rotation;
    }
    if (flip) {
      this.flip = flip;
    }
    if (crop) {
      this.crop = crop;
    }
    if (filters) {
      this.filters = filters;
    }
    if (placeholder) {
      this.placeholder = true;
      this.features = [ElementFeatures.Movable, ElementFeatures.Rotatable];
    }
  }

  public visit<T>(visitor: IVisitor<T>): T {
    return visitor.visitImage(this);
  }
}
