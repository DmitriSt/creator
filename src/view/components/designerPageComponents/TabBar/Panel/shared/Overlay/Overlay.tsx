import React from 'react';

import styles from './overlay.module.scss';

type OverlayPropsType = {
  title?: string;
  minimized?: boolean;
};

const Overlay = ({ title, minimized = false }: OverlayPropsType) => {
  return (
    <div className={`${styles.overlay} ${minimized ? styles.minimized : ''}`}>
      {title || 'Elements are not allowed'}
    </div>
  );
};

export default Overlay;
