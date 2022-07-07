import React from 'react';
import { useDispatch } from 'react-redux';

import { FormatTypes } from '../../../../../../../models/designer/qr.models';
import { DragDropElementType, TabDragDropComponents } from '../../../../../../../models/designer/tabBar.models';
import qrPlaceholder from '../../../../../../assets/images/designer/qr_placeholder.svg';
import { setDraggableElement } from '../../../../../../stores/designerStore/designer/designerActions';
import styles from './tabElement.module.scss';

type QRTabElementPropsType = {
  type: FormatTypes;
};

const QRTabElement = ({ type }: QRTabElementPropsType) => {
  const dispatch = useDispatch();

  const handleMouseDown = () => {
    const element: DragDropElementType<FormatTypes> = {
      type: TabDragDropComponents.QR,
      payload: type,
    };
    dispatch(setDraggableElement(element));
  };

  return (
    <div className={styles.qr} onMouseDown={handleMouseDown}>
      <img className={styles.image} src={qrPlaceholder} alt={type} />
      <div className={styles.blank}>{type}</div>
    </div>
  );
};

export default QRTabElement;
