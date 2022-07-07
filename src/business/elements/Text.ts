import DOMPurify from 'dompurify';

import consts from '../../models/constants/consts';
import { Aligns, ElementFeatures, TextAligns, TextFontType, TextTypes } from '../../models/constants/designer';
import { IMovable, IRotatable, IWithText } from '../interfaces/featuresInterfaces';
import { IVisitor } from '../visitors/visitorsInterfaces';
import BaseElement from './BaseElement';

export default class Text extends BaseElement implements IWithText, IMovable, IRotatable {
  public readonly elementName = 'Text';
  public readonly features = [
    ElementFeatures.Movable,
    ElementFeatures.Rotatable,
    ElementFeatures.Textable,
    ElementFeatures.Colorable,
  ];

  private _text = 'Sample Text';
  private _color = '#000000';
  private _family: TextFontType = consts.designer.DEFAULT_FONT;
  private _size = 14;
  private _align: TextAligns = Aligns.Left;
  private _rotation = 0;
  private _manuallyResized = false;
  private _placeholder = false;
  private _textType: TextTypes = TextTypes.None;

  public get manuallyResized(): boolean {
    return this._manuallyResized;
  }

  public set manuallyResized(resized: boolean) {
    this._manuallyResized = resized;
  }

  public get placeholder(): boolean {
    return this._placeholder;
  }

  public set placeholder(value: boolean) {
    this._placeholder = value;
  }

  public get text(): string {
    return this._text;
  }

  public set text(text: string) {
    const sanitized = DOMPurify.sanitize(text);
    this._text = this.checker(sanitized);
  }

  public get color(): string {
    return this._color;
  }

  public set color(color: string) {
    this._color = color;
  }

  public get fontFamily(): TextFontType {
    return this._family;
  }

  public set fontFamily(family: TextFontType) {
    this._family = family;
  }

  public get fontSize(): number {
    return this._size;
  }

  public set fontSize(size: number) {
    if (size > 0) {
      this._size = size;
    }
  }

  public get align(): TextAligns {
    return this._align;
  }

  public set align(align: TextAligns) {
    this._align = align;
  }

  public get rotation(): number {
    return this._rotation;
  }

  public set rotation(rotation: number) {
    this._rotation = rotation % 360;
    if (this._rotation !== 0) {
      this._manuallyResized = true;
    }
  }

  public get textType(): TextTypes {
    return this._textType;
  }

  public set textType(textType: TextTypes) {
    this._textType = textType;
  }

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    placeholder: boolean,
    manuallyResized?: boolean,
    color?: string,
    family?: TextFontType,
    size?: number,
    align?: TextAligns,
    rotation?: number,
    textType?: TextTypes
  ) {
    super(x, y, width, height);
    this.text = text;
    if (manuallyResized) {
      this.manuallyResized = manuallyResized;
    }
    if (color) {
      this.color = color;
    }
    if (family) {
      this.fontFamily = family;
    }
    if (size) {
      this.fontSize = size;
    }
    if (align) {
      this.align = align;
    }
    if (rotation) {
      this.rotation = rotation;
    }
    if (textType) {
      this.textType = textType;
    }
    this.placeholder = placeholder;
  }

  public checker(test: string): string {
    return test.match(/[\x20-\x7E]+/g)?.join('');
  }

  public visit<T>(visitor: IVisitor<T>): T {
    return visitor.visitText(this);
  }
}
