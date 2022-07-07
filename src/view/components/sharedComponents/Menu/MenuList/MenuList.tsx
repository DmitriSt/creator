import React, { ReactNode } from 'react';

import styles from './menuList.module.scss';

type MenuListPropsType = {
  className: string;
  children: ReactNode[];
};

const MenuList = ({ className, children }: MenuListPropsType) => <ul className={styles[className]}>{children}</ul>;

export default MenuList;
