import throttle from 'lodash.throttle';
import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BaseElement from '../../../../../../../business/elements/BaseElement';
import designer from '../../../../../../../business/elements/Designer';
import Text from '../../../../../../../business/elements/Text';
import * as Guard from '../../../../../../../business/Guard';
import { IRotatable } from '../../../../../../../business/interfaces/featuresInterfaces';
import { IPosition } from '../../../../../../../business/interfaces/interfaces';
import { ElementStatuses } from '../../../../../../../models/constants/designer';
import { ReactComponent as RotationIcon } from '../../../../../../assets/images/designer/rotation.svg';
import checkLayers from '../../../../../../helpers/checkLayers';
import { commandDeleteElement, commandRotateElement } from '../../../../../../helpers/commands';
import { isElementOutOfCanvas } from '../../../../../../helpers/designer';
import { setStatus, updateDesigner } from '../../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../../stores/store';
import styles from './rotateSelector.module.scss';

const invisibleStatuses = [ElementStatuses.TextEditing];

const RotateSelector = () => {
  const dispatch = useDispatch();

  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );
  const status = useSelector((state: RootStateType) => state.designerState.designer.status);
  const coefficient = useSelector((state: RootStateType) => state.designerState.designer.coefficient);
  const zoom = useSelector((state: RootStateType) => state.designerState.designer.zoom);

  const canvasElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance.getCurrentCanvas().elements
  );

  const prevClientRotate = useRef<IPosition>(null);
  const currClientRotate = useRef<IPosition>(null);
  const prevRotate = useRef<number>(null);

  const isManually = useRef(false);

  const rotateRef = useRef<HTMLDivElement>(null);

  const textElements = useMemo(() => selectedElements && Guard.getElementsWithText(selectedElements), [
    selectedElements,
  ]);
  const designerElement = useMemo(
    () => selectedElements && (designer.getElementById(selectedElements[0]?.id) as BaseElement & IRotatable),
    [selectedElements]
  );

  useEffect(() => {
    if (textElements && textElements.length > 0) {
      isManually.current = textElements[0].manuallyResized;
    }
  }, [textElements]);

  const throttledRotate = throttle(() => {
    dispatch(setStatus(ElementStatuses.Rotating));
    if (!currClientRotate.current) return;
    const canvas = document.getElementById('canvas-main');
    if (!canvas) throw new Error('Canvas instance not found');
    const { x, y } = canvas.getBoundingClientRect();
    const angleRad = Math.atan2(
      currClientRotate.current.x - designerElement.x * zoom - x / coefficient,
      -(currClientRotate.current.y - designerElement.y * zoom - y / coefficient)
    );
    const layers = checkLayers(designerElement, canvasElements);
    designer.isLayers = !!layers.length;
    designer.overlapElements = layers;
    designerElement.rotation = angleRad * (180 / Math.PI);
    dispatch(updateDesigner(designer));
  }, 5);

  const handleRotateMouseMove = (e: MouseEvent) => {
    if (selectedElements.length > 0 && Guard.getRotatables(selectedElements)[0] && !isManually.current) {
      (designerElement as Text).manuallyResized = true;
      isManually.current = true;
      dispatch(updateDesigner(designer));
    }
    if (!prevClientRotate.current) return;
    currClientRotate.current = {
      x: e.clientX / coefficient + prevClientRotate.current.x,
      y: e.clientY / coefficient + prevClientRotate.current.y,
    };
    throttledRotate();
  };

  const handleRotateMouseUp = () => {
    document.removeEventListener('mousemove', handleRotateMouseMove);
    document.removeEventListener('mouseup', handleRotateMouseUp);
    const rotation = designerElement.rotation;
    if (prevRotate.current !== rotation) {
      const isOutOfCanvas = isElementOutOfCanvas(designerElement.id);
      if (isOutOfCanvas) {
        commandDeleteElement(dispatch, selectedElements);
        return;
      }
      commandRotateElement(dispatch, prevRotate.current, rotation, designerElement.id);
    }
    dispatch(setStatus(ElementStatuses.Stable));
  };

  const handleRotateMouseDown = (e: React.MouseEvent) => {
    if (!rotateRef.current) return;
    document.addEventListener('mousemove', handleRotateMouseMove);
    document.addEventListener('mouseup', handleRotateMouseUp);
    const bounds = rotateRef.current.getBoundingClientRect();
    prevRotate.current = designerElement.rotation;
    prevClientRotate.current = {
      x: bounds.x + bounds.width / 2 - e.clientX,
      y: bounds.y + bounds.height / 2 - e.clientY,
    };
  };

  const isVisible = useMemo<boolean>(() => !invisibleStatuses.includes(status), [status]);

  return (
    isVisible && (
      <div className={styles.rotation}>
        {status === ElementStatuses.Rotating && (
          <div className={styles.angles} style={{ transform: `rotate(${-designerElement.rotation}deg)` }}>
            {`${Math.round(designerElement.rotation % 360)}`}
          </div>
        )}
        <div ref={rotateRef} className={styles.icon} onMouseDown={handleRotateMouseDown}>
          <RotationIcon className='svg-path-stroke' />
        </div>
      </div>
    )
  );
};

export default RotateSelector;
