import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BackgroundColor from '../../../../../../../../business/elements/BackgroundColor';
import BackgroundImage from '../../../../../../../../business/elements/BackgroundImage';
import BaseElement from '../../../../../../../../business/elements/BaseElement';
import designer from '../../../../../../../../business/elements/Designer';
import { IWithColor } from '../../../../../../../../business/interfaces/featuresInterfaces';
import { DragDropElementType, TabDragDropComponents } from '../../../../../../../../models/designer/tabBar.models';
import { commandRecolorElement, commandReplaceElement } from '../../../../../../../helpers/commands';
import {
  setAdditionalColor,
  setDraggableElement,
  updateDesigner,
} from '../../../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../../../stores/store';
import Colorizer from '../../../../../../sharedComponents/Colorizer/Colorizer';

type ColorizerWrapperPropsType = {
  className?: string;
};

const ColorizerWrapper = ({ className }: ColorizerWrapperPropsType) => {
  const dispatch = useDispatch();

  const additionalColor = useSelector((state: RootStateType) => state.designerState.designer.additionalColor);
  const background = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.getCurrentCanvas().elements[0]
  );

  const [isSelected, setSelected] = useState(false);
  const [move, setMove] = useState({ x: 0, y: 0 });

  const currElementId = useRef<string>(null);
  const isReplaced = useRef(false);

  const handleMouseDown = () => {
    setSelected(true);
  };

  const handleMouseUp = () => {
    setSelected(false);
  };

  useLayoutEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useLayoutEffect(() => {
    if (background) currElementId.current = background.id;
  }, [background]);

  const handleMouseMove = () => {
    if (isSelected) {
      setSelected(false);
      const element: DragDropElementType<IWithColor> = {
        type: TabDragDropComponents.Color,
        payload: {
          color: additionalColor || '#FFFFFF',
        },
      };
      dispatch(setDraggableElement(element));
    }
  };

  const element = useMemo(() => background && designer.getElementById(background.id), [background]);

  const handleColorBeforeChange = () => {
    designer.setSelectedElements([element.id]);
    dispatch(updateDesigner(designer));
  };

  const handleColorChange = (color: string) => {
    if (element instanceof BackgroundImage) isReplaced.current = true;
    (element as BaseElement & IWithColor).color = color;
    dispatch(setAdditionalColor(color));
    dispatch(updateDesigner(designer));
  };

  const handleColorAfterChange = (color: string, prevColor: string) => {
    if (isReplaced.current) {
      const backgroundColorElement = new BackgroundColor(element.x, element.y, element.width, element.height, color);
      commandReplaceElement(dispatch, element, backgroundColorElement);
      isReplaced.current = false;
    } else {
      commandRecolorElement(dispatch, prevColor, color, currElementId.current);
    }
    dispatch(updateDesigner(designer));
  };

  return (
    <div onMouseMove={handleMouseMove}>
      <Colorizer
        className={className}
        initialColor={additionalColor}
        onBeforeChange={handleColorBeforeChange}
        onChange={handleColorChange}
        onAfterChange={handleColorAfterChange}
      />
    </div>
  );
};

export default ColorizerWrapper;
