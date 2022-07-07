import { FormatTypes, VCardType } from '../../models/designer/qr.models';
import { IVisitor } from '../visitors/visitorsInterfaces';
import QR from './QR';

export default class QRVCard extends QR<VCardType> {
  public readonly elementName = 'VCard';
  protected readonly initialValue: VCardType = {
    title: '',
    company: '',
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
    website: '',
  };

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    value: VCardType,
    color?: string,
    rotation?: number
  ) {
    super(x, y, width, height, value, FormatTypes.VCard, color, rotation);
    this.value = value || this.initialValue;
  }

  public visit<T>(visitor: IVisitor<T>): T {
    return visitor.visitQRVCard(this);
  }
}
