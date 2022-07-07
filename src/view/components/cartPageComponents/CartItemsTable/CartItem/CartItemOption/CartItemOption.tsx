import React from 'react';

import { ICartItemOptions } from '../../../../../../models/cart.models';
import { IFilterConfigItem } from '../../../../../../models/commonPage.models';
import { DependentDropdown } from '../../../../sharedComponents/Dropdown/Dropdown';
import Loader from '../../../../sharedComponents/Loader/Loader';
import styles from '../cartItem.module.scss';

type CartItemOptionPropsType = {
  className: string;
  option: ICartItemOptions;
  loadingOption: string | null;
  callback: (item: IFilterConfigItem, id: string) => void;
};

const CartItemOption = ({ className, option, callback, loadingOption }: CartItemOptionPropsType) => {
  const changeOptionValue = (selected: IFilterConfigItem) => {
    if (!loadingOption) {
      callback(selected, option.text);
    }
  };

  return loadingOption === option.text ? (
    <div className={`${className} ${styles.controls_wrapper}`}>
      <Loader isSmall isLocal />
    </div>
  ) : (
    <DependentDropdown
      key={option.text}
      description={option.description}
      selected={option.items.find((item) => item.value === option.selectedValue) || null}
      className={`${className} ${loadingOption && styles.blocked}`}
      items={option.items}
      isReset={false}
      onChange={changeOptionValue}
    />
  );
};

export default CartItemOption;
