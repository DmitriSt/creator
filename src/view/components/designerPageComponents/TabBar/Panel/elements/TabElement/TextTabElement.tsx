import React from 'react';
import { useDispatch } from 'react-redux';

import { IWithText } from '../../../../../../../business/interfaces/featuresInterfaces';
import { DragDropElementType, TabDragDropComponents } from '../../../../../../../models/designer/tabBar.models';
import { setDraggableElement } from '../../../../../../stores/designerStore/designer/designerActions';
import styles from './tabElement.module.scss';

type TextTabElementPropsType = {
  title?: string;
  style: IWithText;
};

const TextTabElement = ({ title, style }: TextTabElementPropsType) => {
  const dispatch = useDispatch();

  const handleMouseDown = () => {
    const element: DragDropElementType<IWithText> = {
      type: TabDragDropComponents.Text,
      payload: style,
    };
    dispatch(setDraggableElement(element));
  };

  return (
    <div className={styles.text} onMouseDown={handleMouseDown} title={title}>
      <span style={{ fontSize: `${style.fontSize}pt` }}>{style.text}</span>
    </div>
  );
};

export default TextTabElement;
