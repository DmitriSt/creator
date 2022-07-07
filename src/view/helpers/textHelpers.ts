import { IDimension } from '../../business/interfaces/interfaces';
import { Aligns, TextFontStyles, TextFontType, TextStyles, TextViewStyles } from '../../models/constants/designer';

export function setNodeSelection(element: Element): Selection {
  if (!element) return null;
  const selection = window.getSelection ? window.getSelection() : document.getSelection();
  selection.removeAllRanges();
  selection.selectAllChildren(element);
  return selection;
}

export function fireEvent() {
  const event = new CustomEvent('selectionchange');
  document.dispatchEvent(event);
}

export function getTextAlign(align: Aligns): 'left' | 'center' | 'right' {
  switch (align) {
    case Aligns.Left:
      return 'left';
    case Aligns.Center:
      return 'center';
    case Aligns.Right:
      return 'right';
    default:
      return 'left';
  }
}

export function getTextBounds(
  innerHTML: string,
  fontSize?: number,
  fontFamily?: string,
  maxWidth?: number
): IDimension {
  const html = innerHTML || '&nbsp';
  const testWrapper = document.createElement('div');
  const testElement = document.createElement('span');
  testWrapper.style.position = `fixed`;
  testWrapper.style.top = '0';
  testWrapper.style.zIndex = '-1';
  testWrapper.style.visibility = `hidden`;
  testWrapper.style.width = `${1e10}vw`; // infinite width :)
  testElement.innerHTML = html;
  testElement.style.display = 'inline-block';
  testElement.style.wordBreak = `break-word`;
  testElement.style.verticalAlign = 'top';
  if (fontSize) {
    testElement.style.fontSize = `${fontSize}pt`;
  }
  if (fontFamily) {
    testElement.style.fontFamily = fontFamily;
  }
  if (maxWidth) {
    testElement.style.maxWidth = `${maxWidth}px`;
  } else {
    testElement.style.whiteSpace = 'nowrap';
  }
  testWrapper.appendChild(testElement);
  document.body.appendChild(testWrapper);
  const { width, height } = testElement.getBoundingClientRect();
  testWrapper.removeChild(testElement);
  document.body.removeChild(testWrapper);
  return {
    width: Math.ceil(width),
    height: Math.ceil(height),
  };
}

function getOuterTags(parent: Element): string[] {
  return parent && !parent.id ? [parent.tagName, ...getOuterTags(parent.parentElement)] : [];
}

function getInnerTags(child: Element): string[] {
  const children = child.children[0];
  const childNodesArray = child.childNodes ? Array.from(child.childNodes) : [];
  const filteredChildNodesArray = childNodesArray.filter((node) => node.nodeName.toLowerCase() !== 'br');
  return child && filteredChildNodesArray.length === 1 && children ? [children.tagName, ...getInnerTags(children)] : [];
}

function mergeFontStyles(config: TextFontStyles, newConfig: TextFontStyles) {
  return {
    color: newConfig.color || config.color,
    fontFamily: newConfig.fontFamily || config.fontFamily,
    fontSize: newConfig.fontSize || config.fontSize,
  };
}

function extractStyles(element: HTMLElement): TextFontStyles | null {
  const isHigher = element.parentElement && !element.parentElement.id;
  const attrs = element.attributes;
  const baseConfig: TextFontStyles = {
    color: '',
    fontFamily: '',
    fontSize: 0,
  };
  if (attrs) {
    Array.from(attrs).forEach((attr) => {
      if (attr.nodeName === 'face') {
        baseConfig.fontFamily = attr.nodeValue as TextFontType;
      }
      if (attr.nodeName === 'color') {
        baseConfig[attr.nodeName] = attr.nodeValue;
      }
      if (attr.nodeName === 'data-size') {
        baseConfig.fontSize = Number.parseInt(attr.nodeValue, 10);
      }
    });
  }
  return isHigher ? mergeFontStyles(baseConfig, extractStyles(element.parentElement)) : baseConfig;
}

function extractTags(tags: string[]): TextStyles[] {
  const boldTags = ['STRONG', 'B'];
  const italicTags = ['EM', 'I'];
  const underlineTags = ['U'];
  return tags
    .map((tag) => {
      if (boldTags.includes(tag)) return TextStyles.Bold;
      if (italicTags.includes(tag)) return TextStyles.Italic;
      if (underlineTags.includes(tag)) return TextStyles.Underline;
      return null;
    })
    .filter((style) => style);
}

export function getSelectionStyles(selection: Selection, bubble = true): TextViewStyles {
  if (selection.rangeCount === 0) return { tags: [], styles: null };
  const range = selection.getRangeAt(0);
  const ref = bubble ? range.startContainer.parentElement : (selection.focusNode as HTMLElement);
  const tags = extractTags(bubble ? getOuterTags(ref) : getInnerTags(ref));
  const styles = bubble ? extractStyles(selection.focusNode as HTMLElement) : null;
  return { tags, styles };
}

export function convertTextContent(id: string, size: string, zoom: number) {
  const div = document.querySelector(`#${id}`);
  const list: NodeListOf<HTMLFontElement | HTMLSpanElement> = div.querySelectorAll('font, span[style]');
  list.forEach((element) => {
    if (element instanceof HTMLFontElement && element.size) {
      element.removeAttribute('size');
      element.style.fontSize = `${+size * zoom}pt`;
      element.dataset.size = size;
    }
    if (element instanceof HTMLSpanElement) {
      element.style.fontSize = `${+size * zoom}pt`;
      element.dataset.size = size;
    }
    if (element.style && !element.style.length) {
      element.removeAttribute('style');
    }
  });
  return div.innerHTML;
}

export function zoomTextContent(content: string, zoom: number) {
  const div = document.createElement('div');
  div.innerHTML = content;
  const list: NodeListOf<HTMLFontElement | HTMLSpanElement> = div.querySelectorAll('*[data-size]');
  list.forEach((element) => {
    const size = element.dataset.size;
    element.style.fontSize = `${+size * zoom}pt`;
  });
  return div.innerHTML;
}
