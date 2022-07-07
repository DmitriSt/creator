import cloneDeep from 'lodash.clonedeep';

import { IMovable } from '../interfaces/featuresInterfaces';
import { IVector } from '../interfaces/interfaces';

export default class MoveManager {
  static move(elements: IMovable[], delta: IVector): IMovable[] {
    const buffer = cloneDeep(elements);
    return buffer.map((element) => {
      element.x += delta.x;
      element.y += delta.y;
      return element;
    });
  }
}
