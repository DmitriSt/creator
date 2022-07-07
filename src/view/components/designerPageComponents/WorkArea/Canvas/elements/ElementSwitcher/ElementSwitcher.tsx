import React from 'react';

import BackgroundColor from '../../../../../../../business/elements/BackgroundColor';
import BackgroundImage from '../../../../../../../business/elements/BackgroundImage';
import BaseElement from '../../../../../../../business/elements/BaseElement';
import Image from '../../../../../../../business/elements/Image';
import QR from '../../../../../../../business/elements/QR';
import Sticker from '../../../../../../../business/elements/Sticker';
import Text from '../../../../../../../business/elements/Text';
import { IPosition } from '../../../../../../../business/interfaces/interfaces';
import BackgroundColorElement from '../BackgroundColorElement/BackgroundColorElement';
import BackgroundImageElement from '../BackgroundImageElement/BackgroundImageElement';
import ImageElement from '../ImageElement/ImageElement';
import QRElement from '../QRElement/QRElement';
import TextElement from '../TextElement/TextElement';

type ElementSwitcherPropsType = {
  element: BaseElement;
  thumbnail: boolean;
  cropMoveShift?: IPosition;
};

const ElementSwitcher = ({ element, thumbnail, cropMoveShift }: ElementSwitcherPropsType) => {
  if (element instanceof Image || element instanceof Sticker) {
    return <ImageElement key={element.id} id={element.id} thumbnail={thumbnail} cropMoveShift={cropMoveShift} />;
  }
  if (element instanceof BackgroundImage) {
    return (
      <BackgroundImageElement key={element.id} id={element.id} thumbnail={thumbnail} cropMoveShift={cropMoveShift} />
    );
  }
  if (element instanceof BackgroundColor) {
    return <BackgroundColorElement key={element.id} id={element.id} thumbnail={thumbnail} />;
  }
  if (element instanceof QR) {
    return <QRElement key={element.id} id={element.id} thumbnail={thumbnail} />;
  }
  if (element instanceof Text) {
    return <TextElement key={element.id} id={element.id} thumbnail={thumbnail} />;
  }
  return null;
};

export default ElementSwitcher;
