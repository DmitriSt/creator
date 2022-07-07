import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import { ParamsType } from '../../../../../../../models/commonPage.models';
import { ThemeCardType } from '../../../../../../../models/themes.models';
import { createDesignWithTemplate } from '../../../../../../../services/designer/designer.service';
import { setActiveTheme } from '../../../../../../stores/themesStore/themes/themesActions';
import Button from '../../../../../sharedComponents/Button/Button';
import styles from './hoverButtons.module.scss';
// import ThemeLike from './ThemeLike/ThemeLike';

type HoverButtonsPropsType = {
  theme: ThemeCardType;
};

const HoverButtons = ({ theme }: HoverButtonsPropsType) => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { id } = useParams<ParamsType>();

  const [isVisible, setVisible] = useState(false);

  const handleClick = () => {
    dispatch(setActiveTheme(theme));
  };

  const showButtons = () => {
    setVisible(true);
  };

  const hideButtons = () => {
    setVisible(false);
  };

  const createDesign = async () => {
    const design = await createDesignWithTemplate(+id, theme.cardId);
    push(`/designer/${design.designId}`);
  };

  return (
    <div className={styles.container} onMouseEnter={showButtons} onMouseLeave={hideButtons}>
      {isVisible && (
        <div className={styles.wrapper}>
          <div className={styles.buttons_wrapper}>
            <Button onClick={createDesign} className={styles.btn} color='secondary' value='Customize' />
            <Button className={styles.btn} variant='outlined' color='inverted' value='Preview' onClick={handleClick} />
          </div>
          {
            // <ThemeLike />
          }
        </div>
      )}
    </div>
  );
};

export default HoverButtons;
