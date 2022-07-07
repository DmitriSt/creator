import React, { useState } from 'react';

import { IFilterConfigItem } from '../../../../../../models/commonPage.models';
import DropdownList from '../../../../sharedComponents/Dropdown/DropdownList/DropdownList';
import styles from './zoomDropdown.module.scss';

type ZoomDropdownPropsType = {
  onChange: (selected: IFilterConfigItem | null) => void;
  selected: IFilterConfigItem | null;
  items: IFilterConfigItem[];
};

const ZoomDropdown = ({ selected, onChange, items }: ZoomDropdownPropsType) => {
  const [isListShowed, setListShowed] = useState(false);

  const handleDropdown = () => {
    setListShowed(!isListShowed);
  };

  const handleSelect = (newSelected: IFilterConfigItem | null) => {
    if (newSelected && newSelected.value === 'reset_dropdown') {
      onChange(null);
      return;
    }
    if (newSelected && newSelected !== selected) {
      onChange(newSelected);
    }
    setListShowed(false);
  };

  return (
    <div className={styles.wrapper} onClick={handleDropdown} data-selected={selected.text}>
      <p className={styles.title}>{selected.text}</p>
      {isListShowed && <DropdownList className={styles.list} items={items} callback={handleSelect} />}
    </div>
  );
};

export default ZoomDropdown;
