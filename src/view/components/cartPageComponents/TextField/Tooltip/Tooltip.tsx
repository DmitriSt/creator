import React from 'react';

import styles from './tooltip.module.scss';

type TooltipPropsType = {
  text: string;
  className?: string;
};

const Tooltip = ({ className, text }: TooltipPropsType) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.inner}>{text}</div>
    </div>
  );
};

export default Tooltip;
