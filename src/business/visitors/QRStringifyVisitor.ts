import QREmail from '../elements/QREmail';
import QRMeCard from '../elements/QRMeCard';
import QRPhone from '../elements/QRPhone';
import QRText from '../elements/QRText';
import QRVCard from '../elements/QRVCard';
import { IVisitor } from './visitorsInterfaces';

export default class QRStringifyVisitor implements IVisitor<string> {
  public visitBackgroundColor(): string {
    throw new Error('Background color element not supported');
  }

  public visitBackgroundImage(): string {
    throw new Error('Background image element not supported');
  }

  public visitImage(): string {
    throw new Error('Image element not supported');
  }

  public visitSticker(): string {
    throw new Error('Sticker element not supported');
  }

  public visitText(): string {
    throw new Error('Text element not supported');
  }

  public visitQREmail(element: QREmail): string {
    const value = element.value;
    return `mailto:${value.email}`;
  }

  public visitQRMeCard(element: QRMeCard): string {
    const value = element.value;

    const firstName = value.firstName || '';
    const lastName = value.lastName || '';
    const address1 = value.address1 || '';
    const address2 = value.address2 || '';
    const city = value.city || '';
    const postalCode = value.postalCode || '';
    const state = value.state || '';
    const country = value.country || '';
    const phone = value.phone || '';
    const email = value.email || '';

    const N = (lastName || firstName) && `N:${lastName},${firstName}`;
    const ADR =
      (address1 || address2 || city || state || postalCode || country) &&
      `ADR:,,${address1} ${address2},${city},${state},${postalCode},${country}`;
    const TEL = phone && `TEL:${phone}`;
    const EMAIL = email && `EMAIL:${email}`;
    const raw = [N, TEL, EMAIL, ADR];
    return `MECARD:${raw.filter((record) => record).join(';')};;`;
  }

  public visitQRVCard(element: QRVCard): string {
    const value = element.value;

    const title = value.title || '';
    const company = value.company || '';
    const firstName = value.firstName || '';
    const lastName = value.lastName || '';
    const address1 = value.address1 || '';
    const address2 = value.address2 || '';
    const city = value.city || '';
    const postalCode = value.postalCode || '';
    const state = value.state || '';
    const country = value.country || '';
    const phone = value.phone || '';
    const email = value.email || '';
    const website = value.website || '';

    const TITLE = title && `TITLE:${title}`;
    const ORG = company && `ORG:${company}`;
    const N = (lastName || firstName) && `N:${lastName};${firstName}`;
    const ADR =
      (address1 || address2 || city || state || postalCode || country) &&
      `ADR:;;${address1} ${address2};${city};${state};${postalCode};${country}`;
    const TEL = phone && `TEL;TYPE=WORK:${phone}`;
    const EMAIL = email && `EMAIL:${email}`;
    const URL = website && `URL:${website}`;
    const raw = [N, TEL, ORG, EMAIL, ADR, URL, TITLE];
    return `BEGIN:VCARD\nVERSION:4.0\n${raw.filter((record) => record).join('\n')}\nEND:VCARD`;
  }

  public visitQRPhone(element: QRPhone): string {
    return `TEL:${element.value.text}`;
  }

  public visitQRText(element: QRText): string {
    return element.value.text;
  }
}
