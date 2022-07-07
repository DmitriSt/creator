import debounce from 'lodash.debounce';
import React, { useCallback } from 'react';

import { IExtendedFilterConfigItem, IFilterConfig } from '../../../../models/commonPage.models';
import Dropdown from '../Dropdown/Dropdown';
import Search from '../Search/Search';
import styles from './selector.module.scss';

type SelectorPropsType = {
  count: number;
  filters?: IFilterConfig[];
  search?: IFilterConfig | null;
  sorting?: IFilterConfig | null;
  onSearch?: (text: string) => void;
  onFilter?: (val: IExtendedFilterConfigItem, key: string) => void;
  searchResults?: number;
  countText?: string;
};

const Selector = ({
  count,
  filters,
  search,
  sorting,
  onSearch,
  searchResults,
  countText,
  onFilter,
}: SelectorPropsType) => {
  const updateFilter = useCallback(
    (val: IExtendedFilterConfigItem, key: string) => {
      if (onFilter) {
        onFilter(val, key);
      }
    },
    [onFilter]
  );

  const onSearchStart = (value: string) => {
    onSearch(value);
  };

  const debounced = debounce((value: string) => onSearch(value), 500);

  const onSearchChange = useCallback(
    (value: string) => {
      if (value === '') {
        onSearch(value);
      } else {
        debounced(value);
      }
    },
    [onSearch]
  );

  return (
    <section className={styles.wrapper}>
      <div className={styles.selector}>
        <div className={styles.counter}>
          {countText ? (
            <>
              <span>{count}</span>
              <span className={styles.count_text}>{countText}</span>
            </>
          ) : (
            count
          )}
        </div>
        <div className={styles.dropdowns}>
          <div className={styles.filters}>
            {filters?.map((filter) => (
              <Dropdown
                key={filter.text}
                initialValue={filter.items.find((el) => el.value === filter.defaultValue) || null}
                description={filter.description}
                items={filter.items}
                style={{ marginRight: '20px' }}
                onChange={(val: IExtendedFilterConfigItem) => updateFilter(val, filter.text)}
              />
            ))}
          </div>
          <div className={styles.search}>
            {search && (
              <Search
                onChange={onSearchChange}
                results={searchResults}
                onSearch={onSearchStart}
                placeholder={search.description}
              />
            )}
          </div>
          <div className={styles.sorting}>
            {sorting && (
              <Dropdown
                key={sorting.text}
                initialValue={sorting.items.find((el) => el.value === sorting.defaultValue) || null}
                description={sorting.description}
                items={sorting.items}
                style={{ width: '240px' }}
                onChange={(val: IExtendedFilterConfigItem) => updateFilter(val, sorting.text)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Selector;
