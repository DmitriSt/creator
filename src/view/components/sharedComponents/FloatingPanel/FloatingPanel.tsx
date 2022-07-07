import _ from 'lodash';
import React, { ReactNode, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { IPosition, IVector } from '../../../../business/interfaces/interfaces';
import { ElementStatuses } from '../../../../models/constants/designer';
import { FloatingPanelPositionType } from '../../../../models/designer/designer.models';
import { getElementBounds, isOutOfElement } from '../../../helpers/designer';
import { RootStateType } from '../../../stores/store';
import Mover from '../Mover/Mover';
import styles from './floatingPanel.module.scss';

type FloatingPanelPropsType = {
  children: ReactNode;
  initial?: FloatingPanelPositionType;
  targetId?: string;
  className?: string;
  style?: React.CSSProperties;
  invisibleStatuses?: ElementStatuses[];
  onClose?: () => void;
  isResetPosition?: boolean;
};

const FloatingPanel = ({
  initial,
  targetId,
  className,
  style,
  invisibleStatuses = [],
  children,
  onClose,
  isResetPosition = false,
}: FloatingPanelPropsType) => {
  const status = useSelector((state: RootStateType) => state.designerState.designer.status);
  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance.selectedElements
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const prevStyle = useRef<React.CSSProperties>(null);
  const isManuallyMoved = useRef(false);

  const [isVisible, setVisible] = useState(false);
  const [movement, setMovement] = useState({ x: 0, y: 0 });

  const onMove = useCallback((dto: IPosition) => {
    setMovement(dto);
    isManuallyMoved.current = !(dto.x === 0 && dto.y === 0);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    if (onClose) onClose();
  }, [onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useLayoutEffect(() => {
    setVisible(!invisibleStatuses.includes(status) && !!children);
  }, [status, children]);

  const styleWithPosition = useMemo<React.CSSProperties>(() => {
    if (!initial) return null;
    const target = document.getElementById(targetId);
    const shift: IVector = {
      x: target ? target.getBoundingClientRect().left : 0,
      y: target ? target.getBoundingClientRect().top : 0,
    };
    const newStyle = {
      ...style,
      transform: `translate(calc(${shift.x}px + ${initial.left}), calc(${shift.y}px + ${initial.top}))`,
    };
    prevStyle.current = newStyle;
    if (movement.x && movement.y) {
      return {
        ...style,
        transform: `translate(${movement.x}px, ${movement.y}px)`,
      };
    }
    return newStyle;
  }, [style, initial, targetId, movement]);

  // useEffect(() => {
  //   return () => {
  //     prevStyle.current = styleWithPosition;
  //     console.log('styleWithPosition', styleWithPosition);
  //   };
  // }, [styleWithPosition]);

  const predictFuturePanelPosition = (workAreaBounds: DOMRect, elementBounds: DOMRect) => {
    const div = document.createElement('div');
    div.style.transform = prevStyle.current.transform;
    div.style.width = `${elementBounds.width}px`;
    div.style.height = `${elementBounds.height}px`;
    div.style.pointerEvents = 'none';
    div.style.visibility = 'hidden';
    div.style.backgroundColor = 'transparent';
    div.className = styles.floating;
    document.body.appendChild(div);
    const isFutureOut = isOutOfElement(workAreaBounds, div.getBoundingClientRect());
    // console.log('isFutureOut', isFutureOut);
    // console.log('prevStyle.current.transform', prevStyle.current.transform);
    // console.log('div.getBoundingClientRect()', div.getBoundingClientRect());
    document.body.removeChild(div);
    if (!isFutureOut) {
      setMovement({ x: 0, y: 0 });
    }
  };

  useLayoutEffect(() => {
    const workAreaBounds = getElementBounds('work-area');
    const elementBounds = children && containerRef.current && containerRef.current.getBoundingClientRect();
    if (isVisible && elementBounds && workAreaBounds) {
      const correctMove = { x: elementBounds.left, y: elementBounds.top };
      const isLeftOut = workAreaBounds.left > elementBounds.left;
      const isRightOut = workAreaBounds.right < elementBounds.right;
      const isTopOut = workAreaBounds.top > elementBounds.top;
      const isBottomOut = workAreaBounds.bottom < elementBounds.bottom;
      const isNowOut = isLeftOut || isRightOut || isTopOut || isBottomOut;
      // console.log('isNowOut', isNowOut);
      // console.log('isLeftOut', isLeftOut);
      // console.log('isRightOut', isRightOut);
      // console.log('isTopOut', isTopOut);
      // console.log('isBottomOut', isBottomOut);
      // console.log('correctMove', JSON.stringify(correctMove));
      // console.log('workAreaBounds', workAreaBounds);
      // console.log('elementBounds', elementBounds);
      if (isNowOut) {
        if (isLeftOut) {
          correctMove.x = workAreaBounds.left + 2;
        }
        if (isTopOut) {
          correctMove.y = workAreaBounds.top + 2;
        }
        if (isRightOut) {
          correctMove.x = workAreaBounds.right - 2 - elementBounds.width;
        }
        if (isBottomOut) {
          correctMove.y = workAreaBounds.bottom - 2 - elementBounds.height;
        }
        // console.log('correctMove', JSON.stringify(correctMove));
        setMovement(correctMove);
      } else if (prevStyle.current && !isManuallyMoved.current) {
        predictFuturePanelPosition(workAreaBounds, elementBounds);
      }
    }
  }, [isVisible, containerRef.current, selectedElements]);

  return (
    isVisible && (
      <div
        ref={containerRef}
        className={`${className} ${styles.floating}`}
        style={styleWithPosition || { display: 'none' }}
        onMouseDown={handleMouseDown}
      >
        <div className={styles.tools}>{children}</div>
        <Mover onClose={handleClose} onMove={onMove} isResetPosition={isResetPosition} />
      </div>
    )
  );
};

export default FloatingPanel;
