import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { IPosition } from '../../../../business/interfaces/interfaces';
import { ReactComponent as CloseIcon } from '../../../assets/images/designer/close.svg';
import { isElementOutOfWorkArea } from '../../../helpers/designer';
import { RootStateType } from '../../../stores/store';
import styles from './mover.module.scss';

const initialMove: IPosition = {
  x: 0,
  y: 0,
};

type MoverPropsType = {
  onMove: (move: IPosition) => void;
  onClose?: () => void;
  isResetPosition?: boolean;
  validationFunction?: (dto: IPosition) => void;
};

const Mover = ({ onMove, onClose, isResetPosition = false, validationFunction }: MoverPropsType) => {
  const coefficient = useSelector((state: RootStateType) => state.designerState.designer.coefficient);
  const zoom = useSelector((state: RootStateType) => state.designerState.designer.zoom);

  const closeIconRef = useRef(null);
  const mover = useRef(null);
  const parent = useRef(null);
  const movement = useRef(initialMove);

  const [isGrabbed, setGrabbed] = useState(false);

  useEffect(() => {
    if (isResetPosition) {
      onMove(initialMove);
      movement.current = initialMove;
    }
  }, [isResetPosition]);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleMoverMouseMove = (e: MouseEvent) => {
    if (!parent.current) return;
    if (isGrabbed) {
      const movementDiff = {
        x: e.movementX * coefficient * zoom,
        y: e.movementY * coefficient * zoom,
      };
      const newMove = {
        x: movement.current.x + movementDiff.x,
        y: movement.current.y + movementDiff.y,
      };
      const isOutOfArea = validationFunction
        ? validationFunction(movementDiff)
        : isElementOutOfWorkArea(parent.current, movementDiff);
      // console.log('isOutOfArea', isOutOfArea);
      if (isOutOfArea) return;
      movement.current = newMove;
      onMove(newMove);
    }
  };

  const handleMoverMouseUp = () => setGrabbed(false);

  const handleMoverMouseDown = (e: React.MouseEvent) => {
    if (e.nativeEvent.composedPath().includes(closeIconRef.current)) return;
    if (mover.current) {
      parent.current = mover.current.parentElement;
      const elBounds = parent.current.getBoundingClientRect();
      setGrabbed(true);
      const initial = {
        x: elBounds.left,
        y: elBounds.top,
      };
      onMove(initial);
      movement.current = initial;
    }
  };

  useEffect(() => {
    if (isGrabbed) {
      document.body.addEventListener('mousemove', handleMoverMouseMove);
      document.body.addEventListener('mouseup', handleMoverMouseUp);
    }
    return () => {
      document.body.removeEventListener('mousemove', handleMoverMouseMove);
      document.body.removeEventListener('mouseup', handleMoverMouseUp);
    };
  }, [isGrabbed]);

  return (
    <div ref={mover} className={styles.mover} onMouseDown={handleMoverMouseDown}>
      <div ref={closeIconRef} className={styles.close} onClick={handleClose}>
        <CloseIcon />
      </div>
    </div>
  );
};

export default Mover;
