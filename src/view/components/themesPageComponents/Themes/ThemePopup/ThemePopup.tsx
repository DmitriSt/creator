import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { ParamsType } from '../../../../../models/commonPage.models';
import { createDesignWithTemplate } from '../../../../../services/designer/designer.service';
import { RootStateType } from '../../../../stores/store';
import { setActiveTheme } from '../../../../stores/themesStore/themes/themesActions';
import Button from '../../../sharedComponents/Button/Button';
import Previewer from './Previewer/Previewer';
import styles from './themePopup.module.scss';

const ThemePopup = () => {
  const wrapperRef = useRef(null);
  const closeRef = useRef(null);
  const { push } = useHistory();
  const { id } = useParams<ParamsType>();

  const dispatch = useDispatch();

  const activeTheme = useSelector((state: RootStateType) => state.themesState.themes.activeTheme);

  const handleClose = () => {
    dispatch(setActiveTheme(null));
  };

  const handleCloseOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === wrapperRef.current || e.target === closeRef.current) {
      handleClose();
    }
  };

  const handleCloseEsc = useCallback((e) => {
    if (e.keyCode === 27) handleClose();
  }, []);

  useEffect(() => {
    if (activeTheme) {
      document.addEventListener('keydown', handleCloseEsc, false);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleCloseEsc, false);
      document.body.style.overflow = 'unset';
      if (activeTheme) handleClose();
    };
  }, [activeTheme]);

  const createDesign = async () => {
    const design = await createDesignWithTemplate(+id, activeTheme.cardId);
    push(`/designer/${design.designId}`);
  };

  return (
    activeTheme && (
      <div ref={wrapperRef} className={styles.wrapper} onClick={handleCloseOnClick}>
        <div className={styles.popup}>
          <div ref={closeRef} className={styles.close} onClick={handleCloseOnClick} />
          <section className={styles.title_section}>
            <span className={styles.title}>{activeTheme?.name}</span>
            <div className={styles.controls}>
              {
                // <Link to='/' className={styles.link}>
                //   Quick Customization
                // </Link>
              }
              <Button className={styles.button} onClick={createDesign} value='Go to Design Studio' />
            </div>
          </section>
          <section className={styles.description}>{activeTheme?.description}</section>
          <Previewer />
        </div>
      </div>
    )
  );
};

export default ThemePopup;
