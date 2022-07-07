import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import designer from '../../../../../../../business/elements/Designer';
import Text from '../../../../../../../business/elements/Text';
import * as Guard from '../../../../../../../business/Guard';
import { IDimension } from '../../../../../../../business/interfaces/interfaces';
import { ElementStatuses } from '../../../../../../../models/constants/designer';
import { DesignerElementType } from '../../../../../../../models/designer/designer.models';
import checkLayers from '../../../../../../helpers/checkLayers';
import { getTextAlign } from '../../../../../../helpers/textHelpers';
import { setStatus, updateDesigner } from '../../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../../stores/store';
import { withMove } from '../../hocs/withMove';
import TextContent from './TextContent/TextContent';

const TextElement = ({ id, thumbnail }: DesignerElementType) => {
  const dispatch = useDispatch();

  const zoom = thumbnail ? 1 : useSelector((state: RootStateType) => state.designerState.designer.zoom);
  const element = useSelector((state: RootStateType) =>
    state.designerState.designer.instance.getElementById(id)
  ) as Text;

  const canvasElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance.getCurrentCanvas().elements
  );

  const translateWrapper = useMemo<string>(() => {
    if (!element) return '';
    const newX = (element.x - element.width / 2) * zoom;
    const newY = (element.y - element.height / 2) * zoom;
    return `translate(${newX} ${newY})`;
  }, [element, zoom]);

  const rotateWrapper = useMemo<string>(() => {
    if (!Guard.isRotatable(element) || element.rotation === 0) return '';
    return `rotate(${element.rotation} ${(element.width * zoom) / 2} ${(element.height * zoom) / 2})`;
  }, [element, zoom]);

  const transformWrapper = useMemo(() => `${translateWrapper} ${rotateWrapper}`, [translateWrapper, rotateWrapper]);

  const dimensions = useMemo<IDimension>(() => {
    if (!element) return { width: 0, height: 0 };
    return {
      width: element.width * zoom,
      height: element.height * zoom,
    };
  }, [element, zoom]);

  const handleMouseDown = () => {
    if (!element && thumbnail) return;
    designer.setSelectedElements([element.id]);
    const layers = checkLayers(element, canvasElements);
    designer.isLayers = !!layers.length;
    designer.overlapElements = layers;
    dispatch(updateDesigner(designer));
  };

  const handleDoubleClick = () => {
    dispatch(setStatus(ElementStatuses.TextEditing));
  };

  return (
    <g transform={transformWrapper} onMouseDown={handleMouseDown} onDoubleClick={handleDoubleClick}>
      <foreignObject
        width={dimensions.width}
        height={dimensions.height}
        style={{ textAlign: getTextAlign(element.align) }}
      >
        <TextContent element={element} zoom={zoom} />
      </foreignObject>
    </g>
  );
};

const WrappedTextElement = withMove(TextElement);

export default WrappedTextElement;
