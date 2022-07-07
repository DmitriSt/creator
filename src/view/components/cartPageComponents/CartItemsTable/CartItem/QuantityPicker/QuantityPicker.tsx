import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IExtendedFilterConfigItem } from '../../../../../../models/commonPage.models';
import Dropdown from '../../../../sharedComponents/Dropdown/Dropdown';
import styles from '../cartItem.module.scss';
import QuantityControl from './QuantityControl/QuantityControl';

type QuantityPickerPropsType = {
  className?: string;
  isDropdown: boolean;
};

const QuantityPicker = ({ className, isDropdown }: QuantityPickerPropsType) => {
  const fakeItems: IExtendedFilterConfigItem[] = [
    {
      value: '1x100',
      text: '1x100',
    },
    {
      value: '2x100',
      text: '2x100',
    },
    {
      value: '3x100',
      text: '3x100',
    },
  ];
  const handleChange = (count: number) => {
    console.log(count);
  };
  return isDropdown ? (
    <Dropdown description='quantity' initialValue={fakeItems[0]} className={styles.dropdown} items={fakeItems} />
  ) : (
    <QuantityControl callback={handleChange} />
  );
};

export default QuantityPicker;
