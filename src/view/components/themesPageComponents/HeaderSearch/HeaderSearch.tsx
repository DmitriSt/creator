import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IExtendedFilterConfigItem } from '../../../../models/commonPage.models';
import { SearchUpdate } from '../../../../models/themes.models';
import { RootStateType } from '../../../stores/store';
import { updateSearch } from '../../../stores/themesStore/search/searchActions';
import Button from '../../sharedComponents/Button/Button';
import Dropdown from '../../sharedComponents/Dropdown/Dropdown';
import Search from '../../sharedComponents/Search/Search';
import styles from './headerSearch.module.scss';

const HeaderSearch = () => {
  const dispatch = useDispatch();
  const { search } = useSelector((state: RootStateType) => state.themesState.search);
  const { filtersConfig, pageConfig } = useSelector((state: RootStateType) => state.themesState.themesPage);
  const filterSearch = filtersConfig?.filters[0];
  const initialValue = filterSearch
    ? filterSearch.items.find((el) => el.value === filterSearch.defaultValue) || null
    : null;
  const backgroundImageSrc = pageConfig && pageConfig.backgroundImage;
  const style = {
    background: `url(${backgroundImageSrc}) no-repeat center center`,
    backgroundSize: 'cover',
  };

  const searchCallback = useCallback(
    (value: string) => {
      if (search && search.Search !== value) {
        const update: SearchUpdate = {
          key: 'Search',
          value,
        };
        dispatch(updateSearch(update));
      }
    },
    [search]
  );

  const filterCallback = useCallback(
    (selected: IExtendedFilterConfigItem) => {
      if (filterSearch && search && search[filterSearch.text] !== selected.value) {
        const update: SearchUpdate = {
          key: filterSearch.text,
          value: selected ? selected.value : null,
        };
        dispatch(updateSearch(update));
      }
    },
    [search]
  );

  return (
    <section className={styles.header} style={style}>
      <span className={styles.title}>Find Your Template</span>
      <div className={styles.controls}>
        <Dropdown
          description={filterSearch?.description}
          initialValue={initialValue}
          items={filterSearch?.items}
          className={styles.dropdown}
          onChange={filterCallback}
        />
        <Search onSearch={searchCallback} placeholder='Search templates' className={styles.search} />
        <Button color='secondary' className={styles.filter} image='ThemesPage/filter.svg' value='filter' />
      </div>
    </section>
  );
};

export default HeaderSearch;
