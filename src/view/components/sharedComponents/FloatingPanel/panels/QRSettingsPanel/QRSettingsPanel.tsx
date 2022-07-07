import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import QR from '../../../../../../business/elements/QR';
import * as Guard from '../../../../../../business/Guard';
import qrPlaceholder from '../../../../../assets/images/designer/qr_placeholder.svg';
import { RootStateType } from '../../../../../stores/store';
import ColorFillButton from '../../../Actions/ColorFillButton/ColorFillButton';
import DeleteButton from '../../../Actions/DeleteButton/DeleteButton';
import styles from './qrSettingsPanel.module.scss';
import SettingsForm from './SettingsForm/SettingsForm';

const QRSettingsPanel = () => {
  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );

  const qrElement = useMemo(() => {
    const elementsWithImage = Guard.getElementsWithColor(selectedElements);
    if (elementsWithImage.length !== 1) return null;
    return elementsWithImage[0] as QR;
  }, [selectedElements]);

  return (
    <div className={styles.settings}>
      <div className={styles.controls}>
        <div className={styles.placeholder}>
          <img className={styles.image} src={qrPlaceholder} alt={`QR code ${qrElement?.format}`} />
          <span className={styles.title}>{qrElement?.format}</span>
        </div>
        <div className={styles.group}>
          <ColorFillButton />
          <DeleteButton style={{ padding: 0 }} />
        </div>
      </div>
      {qrElement && <SettingsForm element={qrElement} />}
    </div>
  );
};
export default QRSettingsPanel;
