import React from 'react';

import { ReactComponent as FilterIcon } from '../../../../assets/images/designer/filter.svg';
import ActionDropdown from '../ActionDropdown/ActionDropdown';
import FiltersPanel from './FiltersPanel/FiltersPanel';

type FiltersDropdownPropsType = {
  titled?: boolean;
};

const FiltersDropdown = ({ titled = true }: FiltersDropdownPropsType) => {
  return (
    <ActionDropdown
      buttonIconAlign='left'
      title={titled ? 'Filters' : ''}
      icon={<FilterIcon className='svg-path-fill' />}
      fixedTitle
    >
      <FiltersPanel />
    </ActionDropdown>
  );
};

export default FiltersDropdown;
