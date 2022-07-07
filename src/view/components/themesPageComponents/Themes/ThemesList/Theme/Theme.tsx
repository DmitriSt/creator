import 'react-lazy-load-image-component/src/effects/blur.css';

import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { ThemeCardType } from '../../../../../../models/themes.models';
import HoverButtons from './HoverButtons/HoverButtons';
import styles from './theme.module.scss';

type ThemePropsType = {
  theme: ThemeCardType;
};

const Theme = ({ theme }: ThemePropsType) => {
  return (
    <div className={styles.map_container}>
      <div className={styles.image_wrapper}>
        <LazyLoadImage
          wrapperClassName={styles.lazy_wrapper}
          className={styles.image}
          effect='blur'
          src={theme.previews[0].url || ''}
          alt={theme.name}
        />
        <HoverButtons theme={theme} />
      </div>
      <p className={styles.subtext}>{theme.name}</p>
    </div>
  );
};

export default Theme;
