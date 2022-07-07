import React, { ReactNode, useState } from 'react';

import styles from './menuItem.module.scss';

type MenuItemPropsType = {
  data?: string | string[];
  className?: string;
  children?: ReactNode | string;
};

const MenuItem = ({ data, className, children }: MenuItemPropsType) => {
  const [isVisible, setVisible] = useState(false);

  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  return (
    <li className={`${className && styles[className]}`} onMouseEnter={show} onMouseLeave={hide}>
      <div className={styles.children_wrapper}>
        {data}
        {isVisible && children}
      </div>
    </li>
  );
};

export default MenuItem;
