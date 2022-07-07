import React from 'react';
import { useDispatch } from 'react-redux';
import uniqid from 'uniqid';

import { IWithColor } from '../../../../../../../business/interfaces/featuresInterfaces';
import { DragDropElementType, TabDragDropComponents } from '../../../../../../../models/designer/tabBar.models';
import { setDraggableElement } from '../../../../../../stores/designerStore/designer/designerActions';
import ColorizerWrapper from './ColorizerWrapper/ColorizerWrapper';
import styles from './tabColors.module.scss';

interface IColorsProps {
  colors: string[];
}

const TabColors = ({ colors }: IColorsProps) => {
  const dispatch = useDispatch();

  const handleMouseDown = (color: string) => {
    const element: DragDropElementType<IWithColor> = {
      type: TabDragDropComponents.Color,
      payload: {
        color,
      },
    };
    dispatch(setDraggableElement(element));
  };

  return (
    <div className={styles.colors}>
      {colors.map((color: string) => (
        <div
          key={uniqid()}
          className={color !== '#FFFFFF' ? styles.color : `${styles.color} ${styles.color_white}`}
          style={{ backgroundColor: color }}
          onMouseDown={() => handleMouseDown(color)}
        />
      ))}
      <ColorizerWrapper className={styles.color} />
    </div>
  );
};

export default TabColors;
