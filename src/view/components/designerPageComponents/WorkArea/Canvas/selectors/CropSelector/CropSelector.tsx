import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import Image from '../../../../../../../business/elements/Image';
import Sticker from '../../../../../../../business/elements/Sticker';
import * as Guard from '../../../../../../../business/Guard';
import { ElementStatuses } from '../../../../../../../models/constants/designer';
import angle from '../../../../../../assets/images/designer/cropAngle.svg';
import { RootStateType } from '../../../../../../stores/store';
import RotateSelector from '../RotateSelector/RotateSelector';
import styles from './cropSelector.module.scss';

const CropSelector = () => {
  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );
  const status = useSelector((state: RootStateType) => state.designerState.designer.status);
  const coefficient = useSelector((state: RootStateType) => state.designerState.designer.coefficient);
  const zoom = useSelector((state: RootStateType) => state.designerState.designer.zoom);

  const activeElement = useMemo(() => (selectedElements?.length ? selectedElements[0] : null), [selectedElements]);
  const visible = useMemo(() => activeElement && status === ElementStatuses.CroppingMode, [activeElement, status]);

  const style = useMemo<React.CSSProperties>(() => {
    if (visible && selectedElements.length) {
      const activeElement = selectedElements[0];
      const width = activeElement.width * zoom * coefficient;
      const height = activeElement.height * zoom * coefficient;
      const posX = activeElement.x * zoom * coefficient - width / 2;
      const posY = activeElement.y * zoom * coefficient - height / 2;
      const transformations = [`translate(${posX}px, ${posY}px)`];
      if (Guard.isRotatables([activeElement])) {
        const element = Guard.getRotatables([activeElement])[0];
        transformations.push(`rotate(${element.rotation}deg)`);
      }
      return {
        width,
        height,
        transform: transformations.join(' '),
      };
    }
    return {
      display: 'none',
    };
  }, [visible, selectedElements, coefficient, zoom]);

  const horLineStyles = useMemo<React.CSSProperties>(() => {
    if (visible && (activeElement instanceof Image || activeElement instanceof Sticker)) {
      return {
        width: activeElement.width * zoom * coefficient,
        height: (activeElement.height / 3) * zoom * coefficient,
      };
    }
    return {
      display: 'none',
    };
  }, [activeElement, coefficient, zoom]);

  const verLineStyles = useMemo<React.CSSProperties>(() => {
    if (visible && (activeElement instanceof Image || activeElement instanceof Sticker)) {
      return {
        width: (activeElement.width / 3) * zoom * coefficient,
        height: activeElement.height * zoom * coefficient,
      };
    }
    return {
      display: 'none',
    };
  }, [activeElement, coefficient, zoom]);

  return (
    visible && (
      <div className={styles.crop} style={style}>
        {Guard.isRotatables([activeElement]) && <RotateSelector />}
        <div className={styles.proportional}>
          <div className={styles.angle}>
            <img src={angle} alt='angle' />
          </div>
          <div className={styles.angle}>
            <img src={angle} alt='angle' />
          </div>
          <div className={styles.angle}>
            <img src={angle} alt='angle' />
          </div>
          <div className={styles.angle}>
            <img src={angle} alt='angle' />
          </div>
        </div>
        <div className={styles.hor_lines} style={horLineStyles} />
        <div className={styles.ver_lines} style={verLineStyles} />
      </div>
    )
  );
};

export default CropSelector;
