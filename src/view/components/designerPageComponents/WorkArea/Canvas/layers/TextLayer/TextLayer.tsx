import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import Text from '../../../../../../../business/elements/Text';
import { getTextAlign } from '../../../../../../helpers/textHelpers';
import { RootStateType } from '../../../../../../stores/store';
import TextContent from '../../elements/TextElement/TextContent/TextContent';

const TextLayer = () => {
  const element = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements[0]
  ) as Text;
  const zoom = useSelector((state: RootStateType) => state.designerState.designer.zoom);

  const translateWrapper = useMemo(() => {
    if (element) {
      const newX = element.x - element.width / 2;
      const newY = element.y - element.height / 2;
      return `translate(${newX * zoom} ${newY * zoom})`;
    }
    return '';
  }, [element?.width, element?.height, element?.x, element?.y, zoom]);

  const rotateWrapper = useMemo(() => {
    if (element && element.rotation !== 0) {
      return `rotate(${element.rotation} ${(element.width * zoom) / 2} ${(element.height * zoom) / 2})`;
    }
    return '';
  }, [element?.rotation, element?.width, element?.height, zoom]);

  const transformWrapper = useMemo(() => `${translateWrapper} ${rotateWrapper}`, [translateWrapper, rotateWrapper]);

  const textAlign = useMemo(() => getTextAlign(element?.align), [element?.align]);

  return (
    !!element && (
      <g transform={transformWrapper}>
        <foreignObject width={element.width * zoom} height={element.height * zoom} style={{ textAlign }}>
          <TextContent element={element} zoom={zoom} editable />
        </foreignObject>
      </g>
    )
  );
};

export default TextLayer;
