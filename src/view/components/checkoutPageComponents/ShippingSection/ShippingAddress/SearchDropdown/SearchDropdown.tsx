import React, { useCallback, useEffect, useRef, useState } from 'react';

import { IFilterConfigItem } from '../../../../../../models/commonPage.models';
import TextField from '../../../../cartPageComponents/TextField/TextField';
import DropdownList from '../../../../sharedComponents/Dropdown/DropdownList/DropdownList';
import styles from './searchDropdown.module.scss';

type SearchDropdownPropsType = {
  searchList: IFilterConfigItem[];
  placeholder: string;
  dependency?: string | null;
  initialValue: string;
  callback: (item: IFilterConfigItem | null) => void;
};

const emptyElement: IFilterConfigItem = {
  text: 'Sorry, nothing matched your search terms.',
  value: 'fake_item',
};

const SearchDropdown = ({ initialValue, dependency, searchList, placeholder, callback }: SearchDropdownPropsType) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFullList, setIsFullList] = useState(false);
  const [isIconDisabled, setIsIconDisabled] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState<IFilterConfigItem | null>(null);
  const isDisabled = dependency === '' || (dependency !== '' && !searchList.length);

  const prevValue = useRef('');
  const wrapperRef = useRef(null);

  const showFullList = () => {
    const newValue = !isFullList;
    setIsFullList(newValue);
    setSearchResults(newValue ? searchList : []);
  };

  const findResults = () => {
    if (selected && selected.text === searchValue) return;
    if (isFullList) setIsFullList(false);
    setSelected(null);
    if (!searchValue && prevValue.current !== '') {
      showFullList();
      setIsIconDisabled(false);
      return;
    }
    const newList = searchValue
      ? searchList.filter((item) => item.text.toLowerCase().startsWith(searchValue.toLowerCase()))
      : [];
    setIsIconDisabled(!!newList.length);
    if (!newList.length && searchValue && !selected) {
      setSearchResults([emptyElement]);
      return;
    }
    setSearchResults(newList);
  };

  useEffect(() => {
    if (dependency === undefined) return;
    prevValue.current = '';
    setSearchValue('');
  }, [dependency]);

  useEffect(() => {
    if (initialValue) {
      const item = searchList.find((el) => el.value === initialValue);
      if (item) {
        setSelected(item);
        setSearchValue(item.text);
      }
    }
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => findResults(), 300);
    return () => clearTimeout(timerId);
  }, [searchValue]);

  useEffect(() => callback(selected), [selected]);

  const updateSearchValue = useCallback((value: string) => {
    prevValue.current = searchValue;
    setSearchValue(value);
  }, []);

  const selectItem = useCallback((value: IFilterConfigItem) => {
    if (!value) return;
    if (value && value.value === 'fake_item') return;
    setSearchValue(value.text);
    setSearchResults([]);
    setIsIconDisabled(false);
    setIsFullList(false);
    setSelected(value);
  }, []);

  const resetList = () => {
    if (isFullList) {
      setIsFullList(false);
    }
    setSearchResults([]);
  };

  const handleClick = useCallback(
    (e: Event) => {
      const path = e.composedPath();
      if (!path.includes(wrapperRef.current) && !!searchResults.length) {
        resetList();
      }
    },
    [searchResults]
  );

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  const onFocus = () => {
    if (!searchValue) {
      showFullList();
    } else if (!isFullList) {
      findResults();
    }
  };

  return (
    <div ref={wrapperRef} className={`${styles.wrapper} ${isDisabled && styles.disabled_dropdown}`}>
      <TextField
        disableFocus={isDisabled}
        onFocus={onFocus}
        initialValue={searchValue}
        onInput={updateSearchValue}
        placeholder={placeholder}
      >
        <div
          onClick={showFullList}
          className={`${styles.icon_wrapper} ${isIconDisabled ? styles.disabled_icon : undefined}`}
        >
          <svg
            className={isFullList ? styles.rotated : undefined}
            width='24'
            height='10'
            viewBox='0 0 24 10'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M2 2L12 8L22 2' strokeWidth='3' strokeLinecap='round' />
          </svg>
        </div>
      </TextField>
      {!!searchResults.length && <DropdownList items={searchResults} callback={selectItem} />}
    </div>
  );
};

export default SearchDropdown;
