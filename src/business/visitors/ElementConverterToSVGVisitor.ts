import QRCode from 'qrcode.react';
import React from 'react';
import ReactDOM from 'react-dom';

import { availableFontVariants } from '../../models/constants/designer';
import { encodeHTML } from '../../view/helpers/designer';
import BackgroundColor from '../elements/BackgroundColor';
import BackgroundImage from '../elements/BackgroundImage';
import DesignImage from '../elements/Image';
import QREmail from '../elements/QREmail';
import QRMeCard from '../elements/QRMeCard';
import QRPhone from '../elements/QRPhone';
import QRText from '../elements/QRText';
import QRVCard from '../elements/QRVCard';
import Sticker from '../elements/Sticker';
import Text from '../elements/Text';
import { ICrop } from '../interfaces/interfaces';
import QRStringifyVisitor from './QRStringifyVisitor';
import { IVisitor } from './visitorsInterfaces';

type TextRes = {
  styles: string;
  svgElement: string;
};

const targetNodes = ['b', 'u', 'i'];

function isNodechilds(nodes: NodeListOf<ChildNode>) {
  return nodes && nodes.length && !(nodes.length === 1 && nodes[0].nodeName === '#text');
}

function getTag(element: HTMLElement | ChildNode) {
  return element.nodeName.toLowerCase();
}

function defineStyleOnTag(tag: string) {
  if (tag === 'b') return 'bold';
  if (tag === 'i') return 'italic';
  return 'normal';
}

function isItalicBold(element: HTMLElement | ChildNode) {
  const text = element.firstChild;
  return text.parentElement.style.fontWeight === 'bold';
}

function defineTextFontStyles(element: HTMLElement | ChildNode) {
  const topTag = getTag(element);
  const tempTags: Set<string> = new Set();
  for (let i = 0; i < element.childNodes.length; i++) {
    const node = element.childNodes[i];
    const tag = getTag(node);
    if (topTag === 'b' || topTag === 'i') {
      if (tag === '#text') {
        tempTags.add(defineStyleOnTag(topTag));
      }
      if ((topTag === 'b' && tag === 'i') || (topTag === 'i' && tag === 'b')) {
        tempTags.add('bold-italic');
      }
      if (tag === 'u') {
        if (isNodechilds(node.childNodes)) {
          for (let i = 0; i < node.childNodes.length; i++) {
            const bottomNode = node.childNodes[i];
            const bottomTag = getTag(bottomNode);
            if ((topTag === 'b' && bottomTag === 'i') || (topTag === 'i' && bottomTag === 'b')) {
              tempTags.add('bold-italic');
            }
          }
        }
      }
    }
    if (topTag === 'u') {
      if (tag === 'i' && isItalicBold(node)) {
        tempTags.add('bold-italic');
      }
      if (isNodechilds(node.childNodes)) {
        for (let i = 0; i < node.childNodes.length; i++) {
          const bottomNode = element.childNodes[i];
          const bottomTag = getTag(bottomNode);
          if (bottomTag === '#text') {
            tempTags.add(defineStyleOnTag(tag));
          }
          if ((tag === 'b' && bottomTag === 'i') || (tag === 'i' && bottomTag === 'b')) {
            tempTags.add('bold-italic');
          }
        }
      } else {
        tempTags.add(defineStyleOnTag(tag));
      }
    }
  }
  if (tempTags.size !== 0) {
    return Array.from(tempTags);
  }
  return defineStyleOnTag(topTag);
}

function getText(element: HTMLDivElement) {
  let styles: Set<string> = new Set();
  for (let i = 0; i < element.childNodes.length; i++) {
    const node = element.childNodes[i];
    const tag = node.nodeName.toLowerCase();
    if (targetNodes.includes(tag)) {
      if (tag === 'i' && isItalicBold(node)) {
        styles.add('bold-italic');
      }
      if (isNodechilds(node.childNodes)) {
        const additionalStyles = defineTextFontStyles(node);
        if (Array.isArray(additionalStyles)) {
          styles = new Set([...styles, ...additionalStyles]);
        } else {
          styles.add(additionalStyles);
        }
      } else {
        styles.add(defineStyleOnTag(tag));
      }
      if (styles.size === 4) {
        break;
      }
    } else {
      styles.add(defineStyleOnTag(tag));
    }
  }
  return styles;
}

export function getTextStyles(text: string): [string[], string] {
  const div = document.createElement('div');
  div.innerHTML = text;
  const styleDTO = getText(div);
  const encodedHTML = encodeHTML(text);
  return [[...styleDTO], encodedHTML];
}

function generateFontFace(fontFamily: string, url: string, isBold: boolean, isItalic: boolean) {
  return `@font-face { font-family: '${fontFamily}'; src: url('${url}'); font-weight: ${
    isBold ? 'bold' : 'normal'
  }; font-style: ${isItalic ? 'italic' : 'normal'}; font-display: swap;}`;
}

export function generateTextFontFamilyStyle(textDecoration: string[], fontFamily: keyof typeof availableFontVariants) {
  const fontInfo = availableFontVariants[fontFamily] || [];
  const baseURL = `https://api.printcreator.com/api/v1/Designs/fonts/${fontFamily}`;
  if (textDecoration.length > 0) {
    return textDecoration.map((item) => {
      if (item === 'bold-italic') {
        const isAvailable = !!fontInfo.find((item) => item === 'bold-italic');
        const url = isAvailable ? `${baseURL}-Bold-Italic` : baseURL;
        return generateFontFace(fontFamily, url, isAvailable, isAvailable);
      }
      if (item === 'bold') {
        const isAvailable = !!fontInfo.find((item) => item === 'bold');
        const url = isAvailable ? `${baseURL}-Bold` : baseURL;
        return generateFontFace(fontFamily, url, isAvailable, false);
      }
      if (item === 'italic') {
        const isAvailable = !!fontInfo.find((item) => item === 'italic');
        const url = isAvailable ? `${baseURL}-Italic` : baseURL;
        return generateFontFace(fontFamily, url, false, isAvailable);
      }
      return generateFontFace(fontFamily, baseURL, false, false);
    });
  }
  return generateFontFace(fontFamily, baseURL, false, false);
}

function getTopLeft(x: number, y: number, width: number, height: number) {
  return [x - width / 2, y - height / 2];
}

function getRotation(rotation: number, width: number, height: number) {
  return `rotate(${rotation} ${width / 2} ${height / 2})`;
}

function getCropppedImageValues(element: DesignImage | BackgroundImage | Sticker) {
  const { width, height, originalHeight, originalWidth, crop, flip } = element;
  const wRatio = width / crop.width;
  const hRatio = height / crop.height;
  const ratio = Math.max(wRatio, hRatio);
  const newX = crop.x * ratio;
  const newY = crop.y * ratio;
  const newWidth = originalWidth * ratio;
  const newHeight = originalHeight * ratio;
  const placeholder: ICrop = {
    x: flip.horizontal ? newWidth - newX : newX,
    y: flip.vertical ? newHeight - newY : newY,
    width: newWidth,
    height: newHeight,
  };
  const leftTop = {
    x: placeholder.x - width / 2,
    y: placeholder.y - height / 2,
  };
  return {
    placeholder,
    viewBox: `viewBox=&quot;${leftTop.x} ${leftTop.y} ${width} ${height}&quot;`,
  };
}

function getImageTransformAttr(element: DesignImage | BackgroundImage | Sticker, placeholder: ICrop) {
  const scale = `scale(${element.flip.horizontal ? -1 : 1} ${element.flip.vertical ? -1 : 1})`;
  const hFlipShift = element.flip.horizontal ? placeholder.width : 0;
  const vFlipShift = element.flip.vertical ? placeholder.height : 0;
  const translate = `translate(${hFlipShift} ${vFlipShift})`;
  return `transform=&quot;${translate} ${scale}&quot;`;
}

function extractImage(element: DesignImage | BackgroundImage | Sticker, rotation = 0) {
  const { x, y, width, height, mediumUrl, source } = element;
  const [positionX, positionY] = getTopLeft(x, y, width, height);
  const rotationValue = rotation ? getRotation(rotation, width, height) : '';
  const { placeholder, viewBox } = getCropppedImageValues(element);
  const imageTransform = getImageTransformAttr(element, placeholder);
  const transform = `transform=&quot;translate(${positionX} ${positionY}) ${rotationValue}&quot;`;
  const href = `href=&quot;${mediumUrl || source}&quot;`;
  const image = `&lt;image preserveAspectRatio=&quot;xMidYMid slice&quot; ${href} ${imageTransform} width=&quot;${placeholder.width}&quot; height=&quot;${placeholder.height}&quot;/&gt;`;
  const svg = `&lt;svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;${width}&quot; height=&quot;${height}&quot; ${viewBox}&gt;${image}&lt;/svg&gt;`;
  return `&lt;g ${transform}&gt;${svg}&lt;/g&gt;`;
}

function extractSticker(element: Sticker) {
  const { x, y, width, height, mediumUrl, source } = element;
  const [positionX, positionY] = getTopLeft(x, y, width, height);
  const rotationValue = element.rotation ? getRotation(element.rotation, width, height) : '';
  const { placeholder, viewBox } = getCropppedImageValues(element);
  const transform = `transform=&quot;translate(${positionX} ${positionY}) ${rotationValue}&quot;`;
  const imageTransform = getImageTransformAttr(element, placeholder);
  const href = `href=&quot;${mediumUrl || source}&quot;`;

  const STICKER_MASK_ID = `sticker-${element.id}`;
  const FILTER_COLOR_ID = `color-${element.id}`;
  const WHITE_RGBA_MATRIX = '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0';
  const display = `display=&quot;${element instanceof Sticker && element.color ? 'none' : 'block'}&quot;`;
  const stickerRect = `&lt;rect mask=&quot;url(#${STICKER_MASK_ID})&quot; display=&quot;block&quot; width=&quot;${width}&quot; height=&quot;${height}&quot; ${imageTransform} fill=&quot;${element.color}&quot; /&gt;`;
  const filter = `&lt;filter id=&quot;${FILTER_COLOR_ID}&quot;&gt;&lt;feColorMatrix in=&quot;SourceGraphic&quot; type=&quot;matrix&quot; values=&quot;${WHITE_RGBA_MATRIX}&quot; /&gt;&lt;/filter&gt;`;
  const style = `style=&quot;webkit-filter: url(#${FILTER_COLOR_ID});filter: url(#${FILTER_COLOR_ID})&quot;`;
  const imageWithFilter = `&lt;image preserveAspectRatio=&quot;none&quot; width=&quot;${width}&quot; height=&quot;${height}&quot; ${href} ${style} /&gt;`;
  const mask = `&lt;mask id=&quot;${STICKER_MASK_ID}&quot;&gt;${filter}${imageWithFilter}&lt;/mask&gt;`;
  const defs = `&lt;defs&gt;${mask}&lt;/defs&gt;`;

  const image = `&lt;image preserveAspectRatio=&quot;xMidYMid slice&quot; ${display} ${href} ${imageTransform} width=&quot;${placeholder.width}&quot; height=&quot;${placeholder.height}&quot;/&gt;`;
  const svg = `&lt;svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;${width}&quot; height=&quot;${height}&quot; ${viewBox}&gt;${defs}${stickerRect}${image}&lt;/svg&gt;`;
  return `&lt;g ${transform}&gt;${svg}&lt;/g&gt;`;
}

function extractQRCode(element: QREmail | QRMeCard | QRPhone | QRVCard | QRText) {
  const { x, y, width, height, color, rotation } = element;
  const visitor = new QRStringifyVisitor();
  const rotationValue = rotation ? getRotation(rotation, width, height) : '';
  const div = document.createElement('div');
  ReactDOM.render(
    React.createElement(
      QRCode,
      {
        value: element.value ? element.visit(visitor) : '',
        width,
        height,
        preserveAspectRatio: 'none',
        bgColor: 'white',
        fgColor: color,
        renderAs: 'svg',
      },
      null
    ),
    div
  );
  const innerSVG = div.innerHTML;
  const encodedSVG = encodeHTML(innerSVG);
  const [positionX, positionY] = getTopLeft(x, y, width, height);
  return `&lt;g transform=&quot;translate(${positionX} ${positionY}) ${rotationValue}&quot;&gt;${encodedSVG}&lt;/g&gt;`;
}

export default class ElementConverterToSVGVisitor implements IVisitor<string | TextRes> {
  visitBackgroundColor(element: BackgroundColor) {
    const { x, y, width, height, color } = element;
    const [positionX, positionY] = getTopLeft(x, y, width, height);
    return `&lt;rect x=&quot;${positionX}&quot; y=&quot;${positionY}&quot; width=&quot;${width}&quot; height=&quot;${height}&quot; fill=&quot;${color}&quot;&gt;&lt;/rect&gt;`;
  }
  visitBackgroundImage(element: BackgroundImage) {
    return extractImage(element);
  }
  visitImage(element: DesignImage) {
    return element.placeholder ? '' : extractImage(element, element.rotation);
  }
  visitQREmail(element: QREmail) {
    return extractQRCode(element);
  }
  visitQRMeCard(element: QRMeCard) {
    return extractQRCode(element);
  }
  visitQRVCard(element: QRVCard) {
    return extractQRCode(element);
  }
  visitQRPhone(element: QRPhone) {
    return extractQRCode(element);
  }
  visitQRText(element: QRText) {
    return extractQRCode(element);
  }
  visitSticker(element: Sticker) {
    return extractSticker(element);
  }

  visitText(element: Text) {
    if (element.placeholder) return '';
    const { x, y, width, height, fontSize, fontFamily, color, text, align, rotation } = element;
    const rotationValue = rotation ? getRotation(rotation, width, height) : '';
    const [textDecoration, textContent] = getTextStyles(text);
    const [positionX, positionY] = getTopLeft(x, y, width, height);
    const style = `font-family: ${fontFamily};font-size: ${fontSize}pt;color: ${color};max-width: ${width}px;word-break: break-word;`;
    const tspans = `&lt;div style=&quot;${style}&quot; xmlns=&quot;http://www.w3.org/1999/xhtml&quot; x=&quot;${positionX}&quot; y=&quot;${positionY}&quot; width=&quot;${width}&quot;&gt;${textContent}&lt;/div&gt;`;
    const fontFamilyStyle = generateTextFontFamilyStyle(textDecoration, fontFamily);
    const styleObject = `text-align: ${align.toLowerCase()};`;
    const svgElement = `&lt;foreignObject style=&quot;${styleObject}&quot; width=&quot;${width}&quot; height=&quot;${height}&quot; transform=&quot;translate(${positionX} ${positionY}) ${rotationValue}&quot;&gt;${tspans}&lt;/foreignObject&gt;`;
    return {
      styles: Array.isArray(fontFamilyStyle) ? fontFamilyStyle.join(' ') : fontFamilyStyle,
      svgElement,
    };
  }
}
