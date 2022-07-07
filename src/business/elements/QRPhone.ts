import { FormatTypes, TextType } from '../../models/designer/qr.models';
import { IVisitor } from '../visitors/visitorsInterfaces';
import QR from './QR';

export default class QRPhone extends QR<TextType> {
  public readonly elementName = 'Phone';
  protected readonly initialValue: TextType = {
    text: '',
  };

  constructor(x: number, y: number, width: number, height: number, value: TextType, color?: string, rotation?: number) {
    super(x, y, width, height, value, FormatTypes.Phone, color, rotation);
    this.value = value || this.initialValue;
  }

  public visit<T>(visitor: IVisitor<T>): T {
    return visitor.visitQRPhone(this);
  }
}
