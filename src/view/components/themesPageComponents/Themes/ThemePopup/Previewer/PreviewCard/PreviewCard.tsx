import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uniqid from 'uniqid';

import { ThemeCardSideType } from '../../../../../../../models/themes.models';
import { RootStateType } from '../../../../../../stores/store';
import { setActiveThemeSide } from '../../../../../../stores/themesStore/themes/themesActions';
import styles from './previewCard.module.scss';

type PreviewCardPropsType = {
  side: ThemeCardSideType;
};

const PreviewCard = ({ side }: PreviewCardPropsType) => {
  const dispatch = useDispatch();

  const activeThemeSide = useSelector((state: RootStateType) => state.themesState.themes.activeThemeSide);

  const isActiveSide = useMemo(() => side === activeThemeSide, [activeThemeSide]);

  const getClassName = useMemo(() => (isActiveSide ? `${styles.card} ${styles.checked}` : styles.card), [isActiveSide]);

  const spanClassName = useMemo(() => (isActiveSide ? `${styles.name} ${styles.active}` : styles.name), [isActiveSide]);

  const handleClick = () => {
    if (!isActiveSide) dispatch(setActiveThemeSide(side));
  };

  return (
    <div className={styles.container} key={uniqid()} onClick={handleClick}>
      <img src={side.url} alt={side.description} className={getClassName} />
      <span key={uniqid()} className={spanClassName}>
        {side.description}
      </span>
    </div>
  );
};

export default PreviewCard;
