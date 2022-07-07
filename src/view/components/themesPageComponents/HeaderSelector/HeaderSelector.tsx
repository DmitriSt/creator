import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import { IExtendedFilterConfigItem, ParamsType } from '../../../../models/commonPage.models';
import { SearchUpdate } from '../../../../models/themes.models';
import { RootStateType } from '../../../stores/store';
import { updateSearch } from '../../../stores/themesStore/search/searchActions';
import Button from '../../sharedComponents/Button/Button';
import Selector from '../../sharedComponents/Selector/Selector';
import styles from './headerSelector.module.scss';

const HeaderSelector = () => {
  const dispatch = useDispatch();
  const { id } = useParams<ParamsType>();
  const { push } = useHistory();
  const { pageConfig, filtersConfig } = useSelector((state: RootStateType) => state.themesState.themesPage);
  const { search, results } = useSelector((state: RootStateType) => state.themesState.search);

  const onSearch = (value: string) => {
    if (filtersConfig && filtersConfig.search) {
      if (search && search[filtersConfig.search.text] === value) return;
      const newStr = filtersConfig.search.items[0].value.replace('/[SEARCH_TERMS]', value === '' ? '' : `/${value}`);
      const update: SearchUpdate = {
        key: filtersConfig.search.text,
        value: newStr,
      };
      dispatch(updateSearch(update));
    }
  };

  const onFilter = useCallback(
    (selected: IExtendedFilterConfigItem | null, key: string) => {
      const update: SearchUpdate = {
        key,
        value: selected ? selected.value : null,
      };
      if (search && selected) {
        if (search[key] !== selected.value) {
          dispatch(updateSearch(update));
        }
      } else {
        dispatch(updateSearch(update));
      }
    },
    [search]
  );

  const goToDesignPage = () => push(`/designer/create-design/${id}`);

  return (
    <>
      <section className={styles.section}>
        <h1 className={styles.title}>Stylize Your Product</h1>
        {pageConfig && pageConfig.showSkipToDesigner && (
          <Button onClick={goToDesignPage} className={styles.button} value='Skip to Design Studio' />
        )}
      </section>
      <Selector
        count={results}
        filters={filtersConfig?.filters}
        search={filtersConfig?.search}
        sorting={filtersConfig?.sort}
        onSearch={onSearch}
        onFilter={onFilter}
        countText='templates'
      />
    </>
  );
};

export default HeaderSelector;
