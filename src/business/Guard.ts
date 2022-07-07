import { ElementFeatures } from '../models/constants/designer';
import BaseElement from './elements/BaseElement';
import {
  ICroppable,
  IFlippable,
  IMovable,
  IRotatable,
  IWithColor,
  IWithFilters,
  IWithImage,
  IWithText,
} from './interfaces/featuresInterfaces';

function isWithFeature(elements: BaseElement[], feature: ElementFeatures): boolean {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i]?.features.includes(feature)) return true;
  }
  return false;
}

function isWithText(elements: unknown[]): boolean {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i]) {
      const test = elements[i] as IWithText;
      if (test.text === undefined || typeof test.text !== 'string') return false;
      if (test.color === undefined || typeof test.color !== 'string') return false;
      if (test.align === undefined || typeof test.align !== 'string') return false;
      if (test.fontFamily === undefined || typeof test.fontFamily !== 'string') return false;
      if (test.fontSize === undefined || typeof test.fontSize !== 'number') return false;
    }
  }
  return true;
}

function isWithImage(elements: unknown[]): boolean {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i]) {
      const test = elements[i] as IWithImage;
      if (test.source === undefined || typeof test.source !== 'string') return false;
      if (test.originalWidth === undefined || typeof test.originalWidth !== 'number') return false;
      if (test.originalHeight === undefined || typeof test.originalHeight !== 'number') return false;
    }
  }
  return true;
}

function isWithColor(elements: unknown[]): boolean {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i]) {
      const test = elements[i] as IWithColor;
      if (test.color === undefined || typeof test.color !== 'string') return false;
    }
  }
  return true;
}

export function getElementsWithText<T extends BaseElement>(elements: T[]): (T & IWithText)[] {
  return elements.filter((element) => isWithText([element])).map((withText) => <T & IWithText>withText);
}

export function getElementsWithImage<T extends BaseElement>(elements: T[]): (T & IWithImage)[] {
  return elements.filter((element) => isWithImage([element])).map((withImage) => <T & IWithImage>withImage);
}

export function getElementsWithColor<T extends BaseElement>(elements: T[]): (T & IWithColor)[] {
  return elements.filter((element) => isWithColor([element])).map((withColor) => <T & IWithColor>withColor);
}

export function isMovable(element: BaseElement): element is BaseElement & IMovable {
  return isWithFeature([element], ElementFeatures.Movable);
}

export function isMovables(elements: BaseElement[]): elements is (BaseElement & IMovable)[] {
  return isWithFeature(elements, ElementFeatures.Movable);
}

export function getMovables<T extends BaseElement>(elements: T[]): (T & IMovable)[] {
  return elements.filter((element) => isMovables([element])) as (T & IMovable)[];
}

export function isFlippable(element: BaseElement): element is BaseElement & IFlippable {
  return isWithFeature([element], ElementFeatures.Flippable);
}

export function isFlippables(elements: BaseElement[]): elements is (BaseElement & IFlippable)[] {
  return isWithFeature(elements, ElementFeatures.Flippable);
}

export function getFlippables<T extends BaseElement>(elements: T[]): (T & IFlippable)[] {
  return elements.filter((element) => isFlippables([element])) as (T & IFlippable)[];
}

export function isRotatable(element: BaseElement): element is BaseElement & IRotatable {
  return isWithFeature([element], ElementFeatures.Rotatable);
}

export function isRotatables(elements: BaseElement[]): elements is (BaseElement & IRotatable)[] {
  return isWithFeature(elements, ElementFeatures.Rotatable);
}

export function getRotatables<T extends BaseElement>(elements: T[]): (T & IRotatable)[] {
  return elements.filter((element) => isRotatable(element)) as (T & IRotatable)[];
}

export function isCroppable(element: BaseElement): element is BaseElement & ICroppable {
  return isWithFeature([element], ElementFeatures.Croppable);
}

export function isCroppables(elements: BaseElement[]): elements is (BaseElement & ICroppable)[] {
  return isWithFeature(elements, ElementFeatures.Croppable);
}

export function getCroppables<T extends BaseElement>(elements: T[]): (T & ICroppable)[] {
  return elements.filter((element) => isCroppable(element)) as (T & ICroppable)[];
}

export function isFilterable(element: BaseElement): element is BaseElement & IWithFilters {
  return isWithFeature([element], ElementFeatures.Filterable);
}

export function isFilterables(elements: BaseElement[]): elements is (BaseElement & IWithFilters)[] {
  return isWithFeature(elements, ElementFeatures.Filterable);
}

export function getFilterables<T extends BaseElement>(elements: T[]): (T & IWithFilters)[] {
  return elements.filter((element) => isFilterable(element)) as (T & IWithFilters)[];
}
