import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BaseElement from '../../../../../../../business/elements/BaseElement';
import designer from '../../../../../../../business/elements/Designer';
import { IWithColor } from '../../../../../../../business/interfaces/featuresInterfaces';
import { IDimension } from '../../../../../../../business/interfaces/interfaces';
import { DesignerElementType } from '../../../../../../../models/designer/designer.models';
import { updateDesigner } from '../../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../../stores/store';

const BackgroundColorElement = ({ id, thumbnail }: DesignerElementType) => {
  const dispatch = useDispatch();

  const isBGEnter = useSelector((state: RootStateType) => state.designerState.tabBar.isBGEnter);
  const zoom = thumbnail ? 1 : useSelector((state: RootStateType) => state.designerState.designer.zoom);
  const element = useSelector((state: RootStateType) =>
    state.designerState.designer.instance.getElementById(id)
  ) as BaseElement & IWithColor;

  const handleMouseDown = () => {
    if (!element && thumbnail) return;
    designer.setSelectedElements([element.id]);
    designer.overlapElements = [];
    dispatch(updateDesigner(designer));
  };

  const dimensions = useMemo<IDimension>(() => {
    if (!element) return { width: 0, height: 0 };
    return {
      width: element.width * zoom,
      height: element.height * zoom,
    };
  }, [element, zoom]);

  return (
    <g onMouseDown={handleMouseDown}>
      <svg
        id={id}
        width={dimensions.width}
        height={dimensions.height}
        style={{ display: 'block' }}
        opacity={isBGEnter ? 0.5 : 1}
      >
        <rect x={0} y={0} width={dimensions.width} height={dimensions.height} fill={element?.color} />
      </svg>
    </g>
  );
};

export default BackgroundColorElement;
