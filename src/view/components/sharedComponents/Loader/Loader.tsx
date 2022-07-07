import React from 'react';

import styles from './loader.module.scss';

type LoaderPropsType = {
  percent?: number;
  radius?: number;
  message?: string;
  isLocal?: boolean;
  isSmall?: boolean;
  className?: string;
};

const Loader = ({
  percent = 30,
  radius = 80,
  message = '',
  isLocal = false,
  isSmall = false,
  className = '',
}: LoaderPropsType) => {
  const PI = 3.14;
  const length = 2 * PI * radius;
  const filled = (length * percent) / 100;
  // const colorSetup = useSelector((state: RootStateType) => state.appState.config.typography);
  const svg = (
    <svg
      className={`${styles.custom_loader} ${className} ${isSmall ? styles.small : styles.big}`}
      id='svg'
      viewBox='0 0 200 200'
    >
      <circle
        className={styles.back}
        r={radius}
        cx='100'
        cy='100'
        fill='none'
        strokeWidth='6'
        stroke='#ccc'
        strokeDasharray={`${length} ${length}`}
      />
      <circle
        className={styles.spinner}
        r={radius}
        cx='100'
        cy='100'
        fill='none'
        strokeWidth='12'
        stroke='orangered'
        strokeDashoffset='-25'
        strokeDasharray={`${filled} ${length}`}
      />
    </svg>
  );
  return !isLocal ? (
    <section className={styles.loader_wrapper}>
      {svg}
      {message}
    </section>
  ) : (
    <>
      {svg}
      {message}
    </>
  );
};

export default Loader;
