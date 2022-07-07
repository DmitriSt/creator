import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TabTypes } from '../../../../../models/designer/tabBar.models';
import { setActiveTab } from '../../../../stores/designerStore/tabBar/tabBarActions';
import { RootStateType } from '../../../../stores/store';
import icons from './icons';
import styles from './tab.module.scss';

type TabPropsType = {
  tab: TabTypes;
  className?: string;
};

const Tab = ({ tab, className }: TabPropsType) => {
  const dispatch = useDispatch();

  const activeTab = useSelector((state: RootStateType) => state.designerState.tabBar.activeTab);

  const getClassName = useMemo(() => (tab === activeTab ? `${styles.tab} ${styles.active}` : styles.tab), [activeTab]);

  const handleClick = () => {
    dispatch(setActiveTab(tab === activeTab ? null : tab));
  };

  return (
    <div className={`${getClassName} ${className || ''}`} onClick={handleClick}>
      <div className={styles.icon}>{icons[tab]}</div>
      <span className={styles.title}>{tab}</span>
    </div>
  );
};

export default Tab;
