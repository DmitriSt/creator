import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as ArrowSmall } from '../../../../../../assets/images/arowSmall.svg';
import ActionButton from '../../../../../sharedComponents/Actions/ActionButton/ActionButton';
import Dropdown from '../../../../../sharedComponents/Dropdown/Dropdown';
import styles from './quantityControl.module.scss';

type QuantityControlPropsType = {
  callback: (count: number) => void;
};

const QuantityControl = ({ callback }: QuantityControlPropsType) => {
  const [count, setCount] = useState(1);
  const increase = () => setCount(count + 1);
  const decrease = () => {
    if (count === 1) return;
    setCount(count - 1);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.count_wrapper}>
        <span className={styles.count}>{count}</span>
        <span className={styles.measure}>piece</span>
      </div>
      <div className={styles.buttons_wrapper}>
        <ActionButton onClick={increase} icon={<ArrowSmall />} />
        <ActionButton onClick={decrease} icon={<ArrowSmall className={styles.icon_rotated} />} />
      </div>
    </div>
  );
};

export default QuantityControl;
