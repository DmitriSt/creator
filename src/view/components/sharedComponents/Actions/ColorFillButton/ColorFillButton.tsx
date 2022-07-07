import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Guard from '../../../../../business/Guard';
import { setShowPalette } from '../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../stores/store';
import ActionButton from '../ActionButton/ActionButton';
import styles from './colorFillButton.module.scss';

type ColorFillPropsType = {
  titled?: boolean;
  color?: string;
};

const ColorFillButton = ({ titled = true, color }: ColorFillPropsType) => {
  const dispatch = useDispatch();

  const isShowPalette = useSelector((state: RootStateType) => state.designerState.designer.isShowPalette);
  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );

  const elementsWithColor = useMemo(() => Guard.getElementsWithColor(selectedElements), [selectedElements]);

  const colorFillComponent = (
    <div
      className={
        color || elementsWithColor[0]?.color ? `${styles.colorFill}` : `${styles.colorFill} ${styles.transparent}`
      }
      style={{ backgroundColor: color || elementsWithColor[0]?.color || '' }}
    />
  );

  const handleShowPalette = () => {
    dispatch(setShowPalette(!isShowPalette));
  };

  return (
    <ActionButton onClick={handleShowPalette} icon={colorFillComponent} value={titled ? 'Color Fill' : undefined} />
  );
};

export default ColorFillButton;
