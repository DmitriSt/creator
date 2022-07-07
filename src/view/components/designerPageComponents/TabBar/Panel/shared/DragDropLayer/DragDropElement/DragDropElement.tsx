import React, { ReactNode, useMemo } from 'react';

import { IPosition } from '../../../../../../../../business/interfaces/interfaces';
import { TabDragDropComponents } from '../../../../../../../../models/designer/tabBar.models';
import arrowTooltip from '../../../../../../../assets/images/designer/arrowTooltip.svg';
import styles from './dragDropElement.module.scss';

type DragDropElementPropsType = {
  element: TabDragDropComponents;
  position: IPosition;
  children?: ReactNode;
  isBgEnter?: boolean;
  isImageReplace?: string;
};

const DragDropElement = ({ element, position, children, isBgEnter, isImageReplace }: DragDropElementPropsType) => {
  const scaleValue = 1;

  const translate = useMemo(
    () => `translate(calc(${position.x / scaleValue}px - 50%), calc(${position.y / scaleValue}px - 50%))`,
    [position.x, position.y]
  );

  const maxWidth = useMemo(() => {
    switch (element) {
      case TabDragDropComponents.Sticker:
        return '70px';
      case TabDragDropComponents.Layout:
        return '250px';
      case TabDragDropComponents.Text:
        return '100%';
      default:
        return '140px';
    }
  }, [element]);

  const transform: React.CSSProperties = useMemo(() => ({ transform: `${translate}`, maxWidth }), [translate]);

  return (
    <div className={styles.wrapper} style={{ cursor: 'grabbing', ...transform }}>
      {isBgEnter && (
        <div className={styles.tooltip}>
          <img className={styles.arrow} src={arrowTooltip} alt='arrow' />
          Replace Background
        </div>
      )}
      {isImageReplace && (
        <div className={styles.tooltip}>
          <img className={styles.arrow} src={arrowTooltip} alt='arrow' />
          Replace Image
        </div>
      )}
      {children}
    </div>
  );
};

export default DragDropElement;
