import BackgroundColor from '../elements/BackgroundColor';
import BackgroundImage from '../elements/BackgroundImage';
import Image from '../elements/Image';
import QREmail from '../elements/QREmail';
import QRMeCard from '../elements/QRMeCard';
import QRPhone from '../elements/QRPhone';
import QRText from '../elements/QRText';
import QRVCard from '../elements/QRVCard';
import Sticker from '../elements/Sticker';
import Text from '../elements/Text';

export interface IVisitor<T> {
  visitBackgroundColor(element: BackgroundColor): T;
  visitBackgroundImage(element: BackgroundImage): T;
  visitImage(element: Image): T;
  visitQREmail(element: QREmail): T;
  visitQRMeCard(element: QRMeCard): T;
  visitQRVCard(element: QRVCard): T;
  visitQRPhone(element: QRPhone): T;
  visitQRText(element: QRText): T;
  visitSticker(element: Sticker): T;
  visitText(element: Text): T;
}

export interface IWithVisitor {
  visit<T>(visitor: IVisitor<T>): T;
}
