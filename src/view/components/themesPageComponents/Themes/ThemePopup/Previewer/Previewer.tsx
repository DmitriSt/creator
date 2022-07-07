import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uniqid from 'uniqid';

import { RootStateType } from '../../../../../stores/store';
import { setActiveThemeSide, setThemesSides } from '../../../../../stores/themesStore/themes/themesActions';
import PreviewCanvas from './PreviewCanvas/PreviewCanvas';
import PreviewCard from './PreviewCard/PreviewCard';
import styles from './previewer.module.scss';

const Previewer = () => {
  const dispatch = useDispatch();

  const activeTheme = useSelector((state: RootStateType) => state.themesState.themes.activeTheme);
  const themeSides = useSelector((state: RootStateType) => state.themesState.themes.themeSides);

  useEffect(() => {
    if (activeTheme) {
      dispatch(setThemesSides(activeTheme.previews));
      dispatch(setActiveThemeSide(activeTheme.previews[0]));
    }
  }, []);

  return (
    <section className={styles.previewer}>
      <PreviewCanvas />
      <div className={styles.sidebar}>
        {themeSides.length > 1 && themeSides.slice(0, 2).map((side) => <PreviewCard key={uniqid()} side={side} />)}
        <div className={styles.description}>
          <span className={styles.name}>{activeTheme?.name}</span>
          <span className={styles.params}>{activeTheme?.description}</span>
        </div>
      </div>
    </section>
  );
};

export default Previewer;
