import React, { useState } from 'react';

import upload from '../../../../assets/images/designer/uploadSmall.svg';
import styles from './reuploadButton.module.scss';

type ReuploadButtonPropsType = {
  callback: () => void;
};

const ReuploadButton = ({ callback }: ReuploadButtonPropsType) => {
  return (
    <button type='button' onClick={callback} className={styles.wrapper}>
      <img src={upload} />
    </button>
  );
};

export default ReuploadButton;
