import cloneDeep from 'lodash.clonedeep';

import { Axes } from '../../models/constants/designer';
import { IFlippable } from '../interfaces/featuresInterfaces';

export default class FlipManager {
  static flip(elements: IFlippable[], type: Axes): IFlippable[] {
    const buffer = cloneDeep(elements);
    return buffer.map((element) => {
      if (type === Axes.Horizontal) {
        element.flip.horizontal = !element.flip.horizontal;
      } else if (type === Axes.Vertical) {
        element.flip.vertical = !element.flip.vertical;
      }
      return element;
    });
  }
}
