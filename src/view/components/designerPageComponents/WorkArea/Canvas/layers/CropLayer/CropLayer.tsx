import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Guard from '../../../../../../../business/Guard';
import { ICrop, IPosition, IVector } from '../../../../../../../business/interfaces/interfaces';
import CropManager from '../../../../../../../business/managers/CropManager';
import { ElementStatuses } from '../../../../../../../models/constants/designer';
import { commandCropElement } from '../../../../../../helpers/commands';
import { rotateByAxes, toRadian } from '../../../../../../helpers/utils';
import { setStatus } from '../../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../../stores/store';
import ElementSwitcher from '../../elements/ElementSwitcher/ElementSwitcher';

const CropLayer = () => {
  const dispatch = useDispatch();

  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );
  const coefficient = useSelector((state: RootStateType) => state.designerState.designer.coefficient);
  const zoom = useSelector((state: RootStateType) => state.designerState.designer.zoom);

  const activeElement = useMemo(() => {
    if (selectedElements.length === 1) {
      const croppables = Guard.getCroppables(selectedElements);
      const flippables = Guard.getFlippables(croppables);
      const elementsWithImage = Guard.getElementsWithImage(flippables);
      return elementsWithImage[0];
    }
    return null;
  }, [selectedElements]);

  const [prevClient, setPrevClient] = useState<IPosition>();
  const [position, setPosition] = useState<IPosition>();
  const [elementCrop, setElementCrop] = useState<ICrop>();
  const [isMoving, setMoving] = useState(false);
  const [isSelected, setSelected] = useState(false);
  const [cropMoveDelta, setCropMoveDelta] = useState({ x: 0, y: 0 });

  const prevPosition = useRef<IPosition>(null);

  useEffect(() => {
    if (activeElement) {
      setPosition({
        x: activeElement.x * zoom,
        y: activeElement.y * zoom,
      });
    }
  }, [activeElement, zoom]);

  const ratio = useMemo(() => {
    const wRatio = activeElement ? activeElement.width / activeElement.crop.width : 1;
    const hRatio = activeElement ? activeElement.height / activeElement.crop.height : 1;
    return Math.max(wRatio, hRatio);
  }, [activeElement]);

  const placeholder = useMemo(() => {
    if (activeElement) {
      const newX = activeElement.crop.x * ratio;
      const newY = activeElement.crop.y * ratio;
      const width = activeElement.originalWidth * ratio;
      const height = activeElement.originalHeight * ratio;
      const region: ICrop = {
        x: activeElement?.flip.horizontal ? width - newX : newX,
        y: activeElement?.flip.vertical ? height - newY : newY,
        width,
        height,
      };
      return region;
    }
    return null;
  }, [ratio, activeElement]);

  const delta = useMemo<IVector>(() => {
    if (!position || !prevPosition.current) return { x: 0, y: 0 };
    return {
      x: position.x - prevPosition.current.x,
      y: position.y - prevPosition.current.y,
    };
  }, [position, prevPosition]);

  const handleMouseMove = (e: MouseEvent) => {
    if (activeElement && placeholder) {
      const shift: IVector = {
        x: (e.clientX / coefficient - prevClient.x) / zoom,
        y: (e.clientY / coefficient - prevClient.y) / zoom,
      };
      const newPosition = CropManager.checkCropMove(activeElement, placeholder, shift);
      newPosition.x *= zoom;
      newPosition.y *= zoom;
      setPosition(newPosition);
    }
  };

  useEffect(() => {
    if (!isMoving && activeElement && elementCrop) {
      const rotatable = Guard.getRotatables([activeElement])[0];
      const rad = rotatable ? toRadian(rotatable.rotation) : 0;
      if (delta.x !== 0 || delta.y !== 0) {
        const newDelta = {
          x: delta.x / zoom,
          y: delta.y / zoom,
        };
        const movedElement = CropManager.move(activeElement, rotateByAxes(newDelta, -rad));
        commandCropElement(dispatch, elementCrop, movedElement.crop, activeElement.id);
        setPosition({ x: activeElement.x * zoom, y: activeElement.y * zoom });
        setElementCrop({
          x: activeElement.crop.x,
          y: activeElement.crop.y,
          width: activeElement.crop.width,
          height: activeElement.crop.height,
        });
      }
    }
  }, [isMoving, delta, zoom]);

  const handleMouseUp = () => {
    setSelected(false);
    setMoving(false);
  };

  useEffect(() => {
    if (isMoving) document.addEventListener('mousemove', handleMouseMove, false);
    if (isSelected) document.addEventListener('mouseup', handleMouseUp, false);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove, false);
      document.removeEventListener('mouseup', handleMouseUp, false);
    };
  }, [isSelected, isMoving]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeElement) {
      setPrevClient({
        x: e.clientX / coefficient,
        y: e.clientY / coefficient,
      });
      setSelected(true);
      if (position) prevPosition.current = { ...position };
      setElementCrop(activeElement.crop);
    }
  };

  const enableMoving = useCallback(() => {
    if (isSelected) setMoving(true);
  }, [isSelected]);

  const handleDoubleClick = () => {
    dispatch(setStatus(ElementStatuses.Stable));
  };

  const translateWrapper = useMemo(() => {
    if (activeElement && isMoving) {
      const rotatable = Guard.getRotatables([activeElement])[0];
      const rad = rotatable ? toRadian(rotatable.rotation) : 0;
      setCropMoveDelta(rotateByAxes(delta, -rad));
      return `translate(${delta.x} ${delta.y})`;
    }
    setCropMoveDelta({ x: 0, y: 0 });
    return 'translate(0 0)';
  }, [activeElement, delta]);

  return (
    !!activeElement && (
      <g
        transform={translateWrapper}
        onMouseDown={handleMouseDown}
        onMouseMove={enableMoving}
        onDoubleClick={handleDoubleClick}
      >
        <ElementSwitcher element={activeElement} cropMoveShift={cropMoveDelta} thumbnail={false} />
      </g>
    )
  );
};

export default CropLayer;
