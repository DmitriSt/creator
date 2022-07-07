import React, { useState } from 'react';

import UploadArea from '../../designerPageComponents/TabBar/Panel/shared/UploadArea/UploadArea';
import Checkbox from '../../sharedComponents/Checkbox/Checkbox';
import ReuploadButton from './ReuploadButton/ReuploadButton';
import styles from './sides.module.scss';

const Sides = () => {
  const [isBackSide, setIsBackSide] = useState(true);
  const [isFrontReapload] = useState(false);
  const [isBackReapload] = useState(false);

  const changeBackSideState = (val: boolean) => {
    setIsBackSide(val);
  };

  const reuploadFrontSide = () => {
    console.log('reupload front side');
  };

  const reuploadBackSide = () => {
    console.log('reupload back side');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.side}>
        <Checkbox initialState disabled label='Front Side' />
        <div className={styles.area}>
          {/* <UploadArea /> */}
          {isFrontReapload && <ReuploadButton callback={reuploadFrontSide} />}
        </div>
      </div>
      <div className={styles.side}>
        <div className={styles.side_header}>
          <Checkbox initialState={isBackSide} label='Back Side' onChange={changeBackSideState} />
          {isBackSide && <p className={styles.text}>Uncheck to remove, skip to leave blank</p>}
        </div>
        {isBackSide && (
          <div className={styles.area}>
            {/* <UploadArea /> */}
            {isBackReapload && <ReuploadButton callback={reuploadBackSide} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sides;
