import { defaultFilters, defaultFlip } from '../../models/constants/defaults';
import { ElementFeatures } from '../../models/constants/designer';
import {
  ICroppable,
  IFlippable,
  IWithFilters,
  IWithFiltersProperties,
  IWithImage,
} from '../interfaces/featuresInterfaces';
import { ICrop, IFlip } from '../interfaces/interfaces';
import { IVisitor } from '../visitors/visitorsInterfaces';
import BaseElement from './BaseElement';

export default class BackgroundImage extends BaseElement implements IWithImage, IWithFilters, IFlippable, ICroppable {
  public readonly elementName = 'Background';

  public readonly features = [
    ElementFeatures.Flippable,
    ElementFeatures.Croppable,
    ElementFeatures.Filterable,
    ElementFeatures.UsableAsImage,
  ];

  private _originalWidth: number;
  private _originalHeight: number;
  private _source = '';
  private _url = '';
  private _mediumUrl = '';
  private _thumbUrl = '';
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

  public get filters(): IWithFiltersProperties {
    return this._filters;
  }

  public set filters(filters: IWithFiltersProperties) {
    this._filters = filters;
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
    flip?: IFlip,
    crop?: ICrop,
    filters?: IWithFiltersProperties
  ) {
    super(x, y, width, height);
    this.source = source;
    this._thumbUrl = thumbUrl;
    this._mediumUrl = mediumUrl;
    this._url = url;
    this._originalWidth = originalWidth;
    this._originalHeight = originalHeight;
    if (flip) {
      this.flip = flip;
    }
    if (crop) {
      this.crop = crop;
    }
    if (filters) {
      this.filters = filters;
    }
  }

  public visit<T>(visitor: IVisitor<T>): T {
    return visitor.visitBackgroundImage(this);
  }
}
