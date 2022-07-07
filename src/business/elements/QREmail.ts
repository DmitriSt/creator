import { EmailType, FormatTypes } from '../../models/designer/qr.models';
import { IVisitor } from '../visitors/visitorsInterfaces';
import QR from './QR';

export default class QREmail extends QR<EmailType> {
  public readonly elementName = 'Email';
  protected readonly initialValue: EmailType = {
    email: '',
  };

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    value: EmailType,
    color?: string,
    rotation?: number
  ) {
    super(x, y, width, height, value, FormatTypes.Email, color, rotation);
    this.value = value || this.initialValue;
  }

  public visit<T>(visitor: IVisitor<T>): T {
    return visitor.visitQREmail(this);
  }
}
