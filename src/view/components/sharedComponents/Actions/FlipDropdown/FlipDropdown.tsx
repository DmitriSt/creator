import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Guard from '../../../../../business/Guard';
import FlipManager from '../../../../../business/managers/FlipManager';
import { Axes } from '../../../../../models/constants/designer';
import { ReactComponent as FlipIcon } from '../../../../assets/images/designer/flip.svg';
import { ReactComponent as FlipHorizontalIcon } from '../../../../assets/images/designer/mirror_horizontal.svg';
import { ReactComponent as FlipVerticalIcon } from '../../../../assets/images/designer/mirror_vertical.svg';
import { commandFlipElement } from '../../../../helpers/commands';
import { RootStateType } from '../../../../stores/store';
import ActionDropdown, { ActionDropdownItemType } from '../ActionDropdown/ActionDropdown';

type FlipDropdownPropsType = {
  titled?: boolean;
};

const iconOpened = (
  <div style={{ transform: 'rotate(90deg)' }}>
    <FlipIcon className='svg-path-stroke' />
  </div>
);

const list: ActionDropdownItemType[] = [
  {
    icon: <FlipHorizontalIcon />,
    name: 'horizontal',
    iconStyle: { width: 20 },
  },
  {
    icon: <FlipVerticalIcon />,
    name: 'vertical',
    iconStyle: { width: 20 },
  },
];

const FlipDropdown = ({ titled = true }: FlipDropdownPropsType) => {
  const dispatch = useDispatch();

  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );

  const handleChange = (item: ActionDropdownItemType) => {
    if (!item?.name) return;
    if (selectedElements.length > 0 && Guard.isFlippables(selectedElements)) {
      const axe = item.name === 'horizontal' ? Axes.Horizontal : Axes.Vertical;
      const flippableElement = Guard.getFlippables(selectedElements)[0];
      const flippedElement = FlipManager.flip([flippableElement], axe)[0];
      commandFlipElement(dispatch, flippableElement.flip, flippedElement.flip, flippableElement.id);
    }
  };

  return (
    <ActionDropdown
      buttonIconAlign='left'
      dropdownWidth={100}
      itemStyle={{ height: 30, color: '#7E898E' }}
      listStyle={{ border: 0 }}
      title={titled ? 'Flip' : ''}
      icon={<FlipIcon className='svg-path-stroke' />}
      iconOpened={iconOpened}
      list={list}
      onChange={handleChange}
      fixedTitle
    />
  );
};

export default FlipDropdown;
