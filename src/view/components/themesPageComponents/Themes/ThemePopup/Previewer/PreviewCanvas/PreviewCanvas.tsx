import React from 'react';
import { useSelector } from 'react-redux';

// import { CardSide } from '../../../../../../../models/themes.models';
// import back from '../../../../../../assets/images/themesPage/back.jpg';
// import front from '../../../../../../assets/images/themesPage/theme.jpg';
import { RootStateType } from '../../../../../../stores/store';
import styles from './previewCanvas.module.scss';

const PreviewCanvas = () => {
  const activeThemeSide = useSelector((state: RootStateType) => state.themesState.themes.activeThemeSide);
  // TODO
  return (
    <div className={styles.canvas_section}>
      <img src={activeThemeSide?.url} alt={activeThemeSide?.description} className={styles.canvas} />
    </div>
  );
};

export default PreviewCanvas;
