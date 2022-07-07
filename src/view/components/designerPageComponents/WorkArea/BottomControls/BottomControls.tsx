import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IFilterConfigItem } from '../../../../../models/commonPage.models';
import { percents } from '../../../../../models/constants/designer';
import { setZoom } from '../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../stores/store';
import Switch from '../../../sharedComponents/Switch/Switch';
import styles from './bottomControls.module.scss';
import ZoomDropdown from './ZoomDropdown/ZoomDropdown';

type BottomControlsPropsType = {
  toggleRulers: (value: boolean) => void;
};

const BottomControls = ({ toggleRulers }: BottomControlsPropsType) => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootStateType) => state.designerState.designer.mainConfig.designSurfaceConfig);
  const [zoom, setZoomValue] = useState(percents[12]);

  const findIndex = () => percents.findIndex((item) => zoom.text === item.text) || 0;

  const updateZoom = (newVal: IFilterConfigItem | null) => {
    setZoomValue(newVal || percents[12]);
    const newZoomValue = newVal ? +newVal.value : +percents[1].value;
    dispatch(setZoom(newZoomValue / 100));
  };

  const increaseZoom = () => {
    if (zoom.value === '300') return;
    const currentIndex = findIndex();
    updateZoom(percents[currentIndex - 1]);
  };

  const decreaseZoom = () => {
    if (zoom.value === '50') return;
    const currentIndex = findIndex();
    updateZoom(percents[currentIndex + 1]);
  };

  return (
    <div className={styles.container}>
      {config.enableHints && <Switch title='Hints' />}
      {config.enableRulers && <Switch title='Rules' onChange={toggleRulers} />}
      <div className={styles.zoom}>
        <button type='button' className={styles.button} onClick={decreaseZoom}>
          <span>-</span>
        </button>
        <ZoomDropdown items={percents} selected={zoom} onChange={updateZoom} />
        <button type='button' className={styles.button} onClick={increaseZoom}>
          <span>+</span>
        </button>
      </div>
    </div>
  );
};

export default BottomControls;
