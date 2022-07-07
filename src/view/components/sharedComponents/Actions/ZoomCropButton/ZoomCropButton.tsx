import React from 'react';
import { useDispatch } from 'react-redux';

import { ElementStatuses } from '../../../../../models/constants/designer';
import { ReactComponent as CropIcon } from '../../../../assets/images/designer/crop.svg';
import { setStatus } from '../../../../stores/designerStore/designer/designerActions';
import ActionButton from '../ActionButton/ActionButton';

type ZoomCropButtonPropsType = {
  titled?: boolean;
};

const ZoomCropButton = ({ titled = true }: ZoomCropButtonPropsType) => {
  const dispatch = useDispatch();

  const cropElement = () => {
    dispatch(setStatus(ElementStatuses.CroppingMode));
  };

  return (
    <ActionButton
      icon={<CropIcon className='svg-path-fill' />}
      value={titled ? 'Zoom / Crop' : undefined}
      onClick={cropElement}
    />
  );
};

export default ZoomCropButton;
