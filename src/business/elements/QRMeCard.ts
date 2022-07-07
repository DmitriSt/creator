import { FormatTypes, MeCardType } from '../../models/designer/qr.models';
import { IVisitor } from '../visitors/visitorsInterfaces';
import QR from './QR';

export default class QRMeCard extends QR<MeCardType> {
  public readonly elementName = 'MeCard';
  protected readonly initialValue: MeCardType = {
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    state: '',
    country: '',
    phone: '',
    email: '',
  };

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    value: MeCardType,
    color?: string,
    rotation?: number
  ) {
    super(x, y, width, height, value, FormatTypes.MeCard, color, rotation);
    this.value = value || this.initialValue;
  }

  public visit<T>(visitor: IVisitor<T>): T {
    return visitor.visitQRMeCard(this);
  }
}
