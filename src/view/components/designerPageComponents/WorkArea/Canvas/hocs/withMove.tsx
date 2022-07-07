import throttle from 'lodash.throttle';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import designer from '../../../../../../business/elements/Designer';
import { IPosition, IVector } from '../../../../../../business/interfaces/interfaces';
import MoveManager from '../../../../../../business/managers/MoveManager';
import { ElementStatuses } from '../../../../../../models/constants/designer';
import { DesignerElementType } from '../../../../../../models/designer/designer.models';
import checkLayers from '../../../../../helpers/checkLayers';
import { commandDeleteElement, commandMoveElement } from '../../../../../helpers/commands';
import { isElementOutOfCanvas } from '../../../../../helpers/designer';
import { setStatus, updateDesigner } from '../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../stores/store';

export function withMove(Child: React.FC<DesignerElementType>) {
  return function wrapper({ id, thumbnail, cropMoveShift }: DesignerElementType) {
    const dispatch = useDispatch();

    const zoom = thumbnail ? 1 : useSelector((state: RootStateType) => state.designerState.designer.zoom);
    const status = useSelector((state: RootStateType) => state.designerState.designer.status);
    const coefficient = useSelector((state: RootStateType) => state.designerState.designer.coefficient);
    const element = useSelector((state: RootStateType) => state.designerState.designer.instance.getElementById(id));
    const canvasElements = useSelector(
      (state: RootStateType) => state.designerState.designer.instance.getCurrentCanvas().elements
    );

    const isMoving = useRef(false);
    const prevClient = useRef<IPosition>(null);
    const prevPosition = useRef<IPosition>(null);
    const nextPosition = useRef<IPosition>(null);

    const throttledMove = throttle((shift: IVector) => {
      const moved = MoveManager.move([element], shift)[0];
      const designerElement = designer.getElementById(id);
      designerElement.x = moved.x;
      designerElement.y = moved.y;
      const layers = checkLayers(designerElement, canvasElements);
      designer.isLayers = !!layers.length;
      designer.overlapElements = layers;
      nextPosition.current = {
        x: moved.x,
        y: moved.y,
      };
      dispatch(setStatus(ElementStatuses.Moving));
      dispatch(updateDesigner(designer));
    }, 10);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMoving.current) return;
      const shift: IVector = {
        x: (e.clientX - prevClient.current.x || 0) / coefficient / zoom,
        y: (e.clientY - prevClient.current.y || 0) / coefficient / zoom,
      };
      if (!shift.x && !shift.y) return;
      throttledMove(shift);
    };

    const handleMouseUp = () => {
      dispatch(setStatus(ElementStatuses.Stable));
      if (isElementOutOfCanvas(id)) {
        commandDeleteElement(dispatch, [element]);
      } else if (
        prevPosition.current &&
        nextPosition.current &&
        (prevPosition.current.x !== nextPosition.current.x || prevPosition.current.y !== nextPosition.current.y)
      ) {
        commandMoveElement(dispatch, prevPosition.current, nextPosition.current, element.id);
      }
      document.body.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseup', handleMouseUp);
      isMoving.current = false;
      prevPosition.current = null;
      nextPosition.current = null;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      if (status === ElementStatuses.Stable) {
        document.body.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseup', handleMouseUp);
        isMoving.current = true;
        prevClient.current = {
          x: e.clientX,
          y: e.clientY,
        };
        prevPosition.current = {
          x: element.x,
          y: element.y,
        };
      }
    };

    return (
      <g onMouseDown={handleMouseDown}>
        <Child id={id} thumbnail={thumbnail} cropMoveShift={cropMoveShift} />
      </g>
    );
  };
}

export default withMove;
