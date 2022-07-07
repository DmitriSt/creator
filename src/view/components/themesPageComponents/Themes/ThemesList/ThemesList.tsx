import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import { ParamsType } from '../../../../../models/commonPage.models';
import { RootStateType } from '../../../../stores/store';
import Theme from './Theme/Theme';
import styles from './themesList.module.scss';

const ThemesList = () => {
  const { id } = useParams<ParamsType>();
  const { push } = useHistory();
  const themes = useSelector((state: RootStateType) => state.themesState.themes.themes);
  const pageSetup = useSelector((state: RootStateType) => state.themesState.themesPage.pageConfig);

  const goToDesignPage = () => push(`/designer/create-design/${id}`);

  return (
    <div className={styles.wrapper}>
      {pageSetup && pageSetup.showBuildYourOwn && (
        <div className={styles.build_new_container}>
          <div className={styles.build_new_btn}>
            <button type='button' onClick={goToDesignPage} className={styles.new_btn_wrapper}>
              <div className={styles.btn}>
                <span className={styles.vertical} />
                <span className={styles.horizontal} />
              </div>
              <p className={styles.build_text}>Build Your Own</p>
            </button>
          </div>
          <p className={styles.subtitle}>Start designing from scratch</p>
        </div>
      )}
      {themes?.map((theme, i) => (
        <Theme key={`${theme.cardId}_${String(i)}`} theme={theme} />
      ))}
    </div>
  );
};

export default ThemesList;
