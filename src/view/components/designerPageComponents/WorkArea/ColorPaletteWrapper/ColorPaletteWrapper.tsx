import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BaseElement from '../../../../../business/elements/BaseElement';
import designer from '../../../../../business/elements/Designer';
import Sticker from '../../../../../business/elements/Sticker';
import * as Guard from '../../../../../business/Guard';
import { IWithColor } from '../../../../../business/interfaces/featuresInterfaces';
import { IPosition } from '../../../../../business/interfaces/interfaces';
import { defaultColorPresets, ElementStatuses } from '../../../../../models/constants/designer';
import { FloatingPanelPositionType } from '../../../../../models/designer/designer.models';
import { commandRecolorElement } from '../../../../helpers/commands';
import { fireEvent } from '../../../../helpers/textHelpers';
import { setShowPalette, updateDesigner } from '../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../stores/store';
import ColorPalette from '../../../sharedComponents/ColorPalette/ColorPalette';
import FloatingPanel from '../../../sharedComponents/FloatingPanel/FloatingPanel';

type ColorPaletteWrapperPropsType = {
  position: IPosition;
};

const ColorPaletteWrapper = ({ position }: ColorPaletteWrapperPropsType) => {
  const dispatch = useDispatch();

  const isShowPalette = useSelector((state: RootStateType) => state.designerState.designer.isShowPalette);
  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance.selectedElements
  );

  const status = useSelector((state: RootStateType) => state.designerState.designer.status);
  const prevColor = useRef<string>(null);

  const deps = useMemo(() => selectedElements?.map((element) => element.id).join(''), [selectedElements]);

  const activeElement = useMemo(() => Guard.getElementsWithColor(selectedElements)[0], [selectedElements]);
  const designerElement = useMemo(
    () => activeElement && (designer.getElementById(activeElement.id) as BaseElement & IWithColor),
    [activeElement]
  );

  const isTextPartColoration = useMemo(() => {
    return designerElement && designerElement.elementName === 'Text' && status === ElementStatuses.TextEditing;
  }, [designerElement, status]);

  useLayoutEffect(() => {
    dispatch(setShowPalette(false));
  }, [deps]);

  const colorPalettePosition = useMemo<FloatingPanelPositionType>(() => {
    return {
      left: `${position.x}px - 50%`,
      top: `${position.y}px`,
    };
  }, [position]);

  const handleBeforeChange = (color: string) => {
    prevColor.current = color;
  };

  const handleChange = (color: string) => {
    if (isTextPartColoration) {
      document.execCommand('foreColor', null, color);
      fireEvent();
      return;
    }
    designerElement.color = color;
    dispatch(updateDesigner(designer));
  };

  const handleAfterChange = (color: string) => {
    if (prevColor.current === null || isTextPartColoration) return;
    commandRecolorElement(dispatch, prevColor.current, color, activeElement.id);
    dispatch(updateDesigner(designer));
    prevColor.current = color;
  };

  const palette = useMemo(() => {
    if (!activeElement) return null;
    const presets = activeElement instanceof Sticker ? ['', ...defaultColorPresets] : defaultColorPresets;
    return isShowPalette ? (
      <ColorPalette
        initialColor={activeElement.color}
        presets={presets}
        onBeforeChange={handleBeforeChange}
        onChange={handleChange}
        onAfterChange={handleAfterChange}
      />
    ) : null;
  }, [activeElement, isShowPalette]);

  const handleClose = () => {
    dispatch(setShowPalette(false));
  };

  return (
    <FloatingPanel
      initial={colorPalettePosition}
      onClose={handleClose}
      invisibleStatuses={[ElementStatuses.Moving, ElementStatuses.Rotating]}
    >
      {palette}
    </FloatingPanel>
  );
};

export default ColorPaletteWrapper;
