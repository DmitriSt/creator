import cloneDeep from 'lodash.clonedeep';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BaseElement from '../../../../../../../business/elements/BaseElement';
import { createCanvasConfig } from '../../../../../../../business/factories/designerToConfigFactory';
import { commandToggleCanvasAvailability } from '../../../../../../helpers/commands';
import { getDisabledCanvasFromSession } from '../../../../../../helpers/designer';
import useDesignerURL from '../../../../../../hooks/useDesignerURL';
import { RootStateType } from '../../../../../../stores/store';
import Checkbox, { DependentCheckbox } from '../../../../../sharedComponents/Checkbox/Checkbox';
import styles from './availableCanvasToggler.module.scss';

const AvailableCanvasToggler = () => {
  const dispatch = useDispatch();
  const [designId] = useDesignerURL();

  const canvases = useSelector((state: RootStateType) => state.designerState.designer.instance?.getAllCanvases());

  const changeAvailability = (val: boolean, id: number, name: string) => {
    const oldCanvas = cloneDeep(canvases.find((canvas) => canvas.canvasId === id && canvas.name === name));
    let newElements: BaseElement[] = [];
    if (!val) {
      sessionStorage.setItem(
        `disabled_${designId}_${oldCanvas.name}_${oldCanvas.canvasId}`,
        JSON.stringify(createCanvasConfig(oldCanvas))
      );
    } else {
      const disabledCanvas = getDisabledCanvasFromSession(designId, oldCanvas.name, oldCanvas.canvasId);
      if (disabledCanvas) {
        newElements = disabledCanvas.elements;
      }
    }
    commandToggleCanvasAvailability(dispatch, id, name, !val, oldCanvas.elements, newElements);
  };

  return (
    canvases && (
      <div className={styles.settings}>
        <p className={styles.title}>AVAILABLE CANVASES</p>
        {canvases.map((canvas, i) => {
          if (i === 0) {
            return <Checkbox key={canvas.name} initialState disabled label={canvas.name} />;
          }
          return (
            <DependentCheckbox
              key={canvas.name}
              checked={!canvas.disabled}
              label={canvas.name}
              onChange={(val: boolean) => changeAvailability(val, canvas.canvasId, canvas.name)}
            />
          );
        })}
      </div>
    )
  );
};

export default AvailableCanvasToggler;
