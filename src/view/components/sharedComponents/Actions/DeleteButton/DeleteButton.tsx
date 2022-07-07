import React, { CSSProperties, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BackgroundColor from '../../../../../business/elements/BackgroundColor';
import BackgroundImage from '../../../../../business/elements/BackgroundImage';
import { ReactComponent as DeleteIcon } from '../../../../assets/images/designer/delete.svg';
import { commandDeleteBackground, commandDeleteElement } from '../../../../helpers/commands';
import { RootStateType } from '../../../../stores/store';
import ActionButton from '../ActionButton/ActionButton';

type DeleteButtonPropsType = {
  titled?: boolean;
  style?: CSSProperties;
};

const DeleteButton = ({ titled = true, style }: DeleteButtonPropsType) => {
  const dispatch = useDispatch();

  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );

  const deleteElement = () => {
    if (
      selectedElements.length === 1 &&
      (selectedElements[0] instanceof BackgroundColor || selectedElements[0] instanceof BackgroundImage)
    ) {
      commandDeleteBackground(dispatch, selectedElements[0]);
    } else {
      commandDeleteElement(dispatch, selectedElements);
    }
  };

  const handleDeletePress = (e: KeyboardEvent) => {
    e.stopImmediatePropagation();
    if (e.key === 'Delete' || e.key === 'Del' || e.key === 'Backspace') {
      deleteElement();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleDeletePress);
    return () => {
      document.removeEventListener('keydown', handleDeletePress);
    };
  }, []);

  return (
    <ActionButton
      icon={<DeleteIcon className='svg-path-fill' />}
      value={titled ? 'Delete' : undefined}
      style={style}
      onClick={deleteElement}
    />
  );
};

export default DeleteButton;
