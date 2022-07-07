import React, { useEffect, useRef } from 'react';
import uniqid from 'uniqid';

import { IExtendedFilterConfigItem } from '../../../../../models/commonPage.models';
import dropdownStyles from '../dropdown.module.scss';
import styles from './dropdownList.module.scss';

type DropdownListType = {
  items: IExtendedFilterConfigItem[];
  callback: (selected: IExtendedFilterConfigItem | null) => void;
  className?: string;
};

const DropdownList = ({ items, callback, className = '' }: DropdownListType) => {
  const wrapperRef = useRef(null);

  const handleSelect = (item: IExtendedFilterConfigItem) => {
    callback(item);
  };

  const useOutsideAlerter = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
          callback(null);
        }
      }
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, [ref]);
  };

  useOutsideAlerter(wrapperRef);

  return (
    <div ref={wrapperRef} className={`${styles.wrapper} ${className}`}>
      {items.map((item) => (
        <button
          type='button'
          key={uniqid()}
          className={`${dropdownStyles.item} ${dropdownStyles.hovered}`}
          onClick={() => handleSelect(item)}
        >
          {item.icon && <img src={item.icon} />}
          {item.text}
        </button>
      ))}
    </div>
  );
};

export default DropdownList;
