import cloneDeep from 'lodash.clonedeep';

import BackgroundColor from '../../business/elements/BackgroundColor';
import Canvas from '../../business/elements/Canvas';
import designer from '../../business/elements/Designer';
import Page from '../../business/elements/Page';
import createCanvas from '../../business/factories/configToCanvasFactory';
import convertToCanvas from '../../business/factories/initialCanvasToCanvasFactory';
import { IPosition } from '../../business/interfaces/interfaces';
import consts from '../../models/constants/consts';
import { DesignerProductConfig } from '../../models/designer/designer.models';

export function getDisabledCanvasFromSession(designId: string, name: string, id: number) {
  const disabledCanvas = sessionStorage.getItem(`disabled_${designId}_${name}_${id}`);
  if (disabledCanvas) {
    return createCanvas(JSON.parse(disabledCanvas));
  }
  return null;
}

export function removeOldDisabledCanvases(designId: string) {
  const canvasesKeys = Object.keys(sessionStorage).filter((item) => item.startsWith(`disabled_${designId}`));
  canvasesKeys.forEach((key) => sessionStorage.removeItem(key));
}

export function addDisabledCanvases(config: DesignerProductConfig, designId = '') {
  const defaultPages = config.pages;
  const activePages = designer.pages;
  // activePages.map((page) => {
  //   page.canvases[0] = new withMove(
  //     page.canvases[0].width,
  //     page.canvases[0].height,
  //     page.canvases[0].name,
  //     page.canvases[0].elements,
  //     page.id,
  //     page.canvases[0].layoutId,
  //     page.canvases[0].left,
  //     page.canvases[0].top,
  //     page.canvases[0].bleed,
  //     page.canvases[0].disabled
  //   );
  //   return page;
  // });
  defaultPages.forEach((defaultPage, index) => {
    const page = activePages[index];
    if (!page) return;
    // page.backgroundUrl = 'https://pngimg.com/uploads/tshirt/tshirt_PNG5429.png';
    const defaultCanvases = cloneDeep(defaultPage.canvases);
    const activeCanvases: Canvas[] = [];
    defaultCanvases.forEach((defaultCanvas, i) => {
      const { isTransparent } = defaultCanvas.backgroundOptions;
      const canvas = page.canvases[i];
      if (canvas && canvas.canvasId === defaultCanvas.id) {
        const copyCanvas = cloneDeep(canvas);
        // copyCanvas.height = 400;
        // copyCanvas.width = 750;
        // copyCanvas.top = 200;
        // copyCanvas.left = 300;
        copyCanvas.elements = copyCanvas.elements.map((el) => {
          if (el instanceof BackgroundColor && isTransparent) {
            const bgElem = el as BackgroundColor;
            bgElem.color = 'transparent';
            return bgElem;
          }
          return el;
        });
        activeCanvases.push(copyCanvas);
        return;
      }
      const disabledCanvas = getDisabledCanvasFromSession(designId, defaultCanvas.name, defaultCanvas.id);
      if (disabledCanvas) {
        disabledCanvas.elements = [];
        disabledCanvas.disabled = true;
        activeCanvases.push(disabledCanvas);
        return;
      }
      activeCanvases.push(convertToCanvas(defaultCanvas, designer.layoutId));
    });
    designer.pages[index] = new Page(
      page.name,
      page.width,
      page.height,
      page.backgroundUrl,
      page.overlayUrl,
      page.id,
      activeCanvases
    );
  });
}

export function encodeHTML(element: string) {
  let newStr = '';
  for (let i = 0; i < element.length; i++) {
    const sign = element[i];
    if (sign === '"') {
      newStr += '&quot;';
    } else if (sign === '>') {
      if (element[i - 1] === 'r' && element[i - 2] === 'b') {
        newStr += '/&gt;';
      } else newStr += '&gt;';
    } else if (sign === '<') {
      newStr += '&lt;';
    } else newStr += sign;
  }
  return newStr;
}

export function getElementBounds(id: string) {
  const element = document.getElementById(id);
  if (!element) return null;
  return element.getBoundingClientRect();
}

export function isElementOutOfCanvas(elementID: string, canvasID = 'canvas-main') {
  const padding = consts.resizeSelector.PADDING;
  const canvasBounds = getElementBounds(canvasID);
  const elBounds = getElementBounds(elementID);
  if (canvasBounds && elBounds) {
    return (
      canvasBounds.left > elBounds.right + padding ||
      canvasBounds.top > elBounds.bottom + padding ||
      canvasBounds.right < elBounds.left - padding ||
      canvasBounds.bottom < elBounds.top - padding
    );
  }
  throw Error('Can`t get bounds');
}

export function isElementOutOfWorkArea(containerRef: HTMLDivElement, movement?: IPosition) {
  movement = movement || { x: 0, y: 0 };
  const workAreaBounds = getElementBounds('work-area');
  const elBounds = containerRef.getBoundingClientRect();
  if (workAreaBounds && elBounds) {
    return (
      workAreaBounds.left > elBounds.left + movement.x ||
      workAreaBounds.top > elBounds.top + movement.y ||
      workAreaBounds.right < elBounds.right + movement.x ||
      workAreaBounds.bottom < elBounds.bottom + movement.y
    );
  }
  throw Error('Can`t get bounds');
}

export function isOutOfElement(parent: DOMRect, child: DOMRect) {
  return (
    parent.left > child.left || parent.top > child.top || parent.right < child.right || parent.bottom < child.bottom
  );
}
