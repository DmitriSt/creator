import BackgroundColor from '../../business/elements/BackgroundColor';
import BackgroundImage from '../../business/elements/BackgroundImage';
import BaseElement from '../../business/elements/BaseElement';
import * as Guard from '../../business/Guard';
// import { IPosition } from '../../business/interfaces/interfaces';
import { getDiag, getDistPoints, rotateByAxes, toRadian } from './utils';

interface ISection {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

// const MARKER_RADIUS = 4;

// function clearCanvas() {
//   const canvas = document.getElementById('canvas-temp') as HTMLCanvasElement;
//   const ctx = canvas.getContext('2d');
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
// }

// function setMarker(x: number, y: number, color = '#FF0000') {
//   // const canvasSVG = document.getElementById('canvas-main');
//   const canvas = document.getElementById('canvas-temp') as HTMLCanvasElement;
//   const ctx = canvas.getContext('2d');
//   ctx.fillStyle = color;
//   ctx.beginPath();
//   ctx.arc(x, y, MARKER_RADIUS, 0, 2 * Math.PI);
//   ctx.fill();
// }

function toSections(activeElement: BaseElement) {
  const rotation = toRadian(Guard.getRotatables([activeElement])[0]?.rotation || 0);
  const rotated = [
    rotateByAxes({ x: -activeElement.width / 2, y: -activeElement.height / 2 }, rotation),
    rotateByAxes({ x: activeElement.width / 2, y: -activeElement.height / 2 }, rotation),
    rotateByAxes({ x: activeElement.width / 2, y: activeElement.height / 2 }, rotation),
    rotateByAxes({ x: -activeElement.width / 2, y: activeElement.height / 2 }, rotation),
  ];
  // rotated.forEach((item) => setMarker(activeElement.x + item.x, activeElement.y + item.y));
  return rotated.map((point, i, arr) => ({
    x1: activeElement.x + point.x,
    y1: activeElement.y + point.y,
    x2: activeElement.x + arr[(i + 1) % arr.length].x,
    y2: activeElement.y + arr[(i + 1) % arr.length].y,
  }));
}

function isInside(sections: ISection[], point: BaseElement) {
  for (let i = 0; i < sections.length; i++) {
    const D =
      (sections[i].x2 - sections[i].x1) * (point.y - sections[i].y1) -
      (point.x - sections[i].x1) * (sections[i].y2 - sections[i].y1);
    if (D < 0) return false;
  }
  return true;
}

export default function checkLayers(activeElement: BaseElement, canvasElements: BaseElement[]) {
  // const intersections: IPosition[] = [];
  const overlapElements: BaseElement[] = [];
  // clearCanvas();
  const suspects = canvasElements.filter((suspect) => {
    if (suspect.id === activeElement.id) return null;
    if (suspect instanceof BackgroundColor || suspect instanceof BackgroundImage) return null;
    const dist = getDistPoints(activeElement, suspect);
    const targetDiag = getDiag(activeElement.width, activeElement.height);
    const suspectDiag = getDiag(suspect.width, suspect.height);
    return targetDiag + suspectDiag >= dist * 2;
  });

  if (suspects.length === 0) return [];

  const activeElementSections = toSections(activeElement);

  for (let i = 0; i < activeElementSections.length; i++) {
    const a1 = activeElementSections[i].x2 - activeElementSections[i].x1;
    const a2 = activeElementSections[i].y2 - activeElementSections[i].y1;
    for (let j = 0; j < suspects.length; j++) {
      const suspectSections = toSections(suspects[j]);
      if (isInside(activeElementSections, suspects[j]) || isInside(suspectSections, activeElement)) {
        overlapElements.push(suspects[j], activeElement);
        // return true;
      }
      for (let k = 0; k < suspectSections.length; k++) {
        const b1 = suspectSections[k].x2 - suspectSections[k].x1;
        const b2 = suspectSections[k].y2 - suspectSections[k].y1;
        const div = a1 * b2 - a2 * b1;
        if (div !== 0) {
          const c1 = suspectSections[k].x1 - activeElementSections[i].x1;
          const c2 = suspectSections[k].y1 - activeElementSections[i].y1;
          const s = (c1 * b2 - c2 * b1) / div;
          const t = (a1 * c2 - a2 * c1) / div;
          if (s >= 0 && s <= 1 && t >= -1 && t <= 0) {
            overlapElements.push(suspects[j], activeElement);
            // return true;
            // const posX = activeElementSections[i].x1 + s * (activeElementSections[i].x2 - activeElementSections[i].x1);
            // const posY = activeElementSections[i].y1 + s * (activeElementSections[i].y2 - activeElementSections[i].y1);
            // intersections.push({ x: posX, y: posY });
          }
        }
      }
    }
  }
  // intersections.forEach((point) => setMarker(point.x, point.y, '#00FF00'));
  // return intersections.length > 0;
  const uniqueOverlapArray = [...new Set(overlapElements)];
  const correctPosElementsArray: BaseElement[] = [];
  canvasElements.forEach((el) => {
    const overlapElement = uniqueOverlapArray.filter((element) => element.id === el.id)[0];
    if (overlapElement) correctPosElementsArray.push(overlapElement);
  });
  return correctPosElementsArray.reverse();
}
