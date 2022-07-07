import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Guard from '../../../../../../business/Guard';
import ResizeManager from '../../../../../../business/managers/ResizeManager';
import { ElementStatuses } from '../../../../../../models/constants/designer';
import { ReactComponent as ArrowIcon } from '../../../../../assets/images/designer/arrow.svg';
import { commandUpdateTextSize } from '../../../../../helpers/commands';
import { convertTextContent } from '../../../../../helpers/textHelpers';
import { RootStateType } from '../../../../../stores/store';
import ActionDropdown, { ActionDropdownItemType } from '../../ActionDropdown/ActionDropdown';

const sizes = [8, 9, 10, 11, 12, 13, 14, 18, 24, 36, 48, 64, 72, 96, 144, 288];

type FontSizeDropdownPropsType = {
  fontSize?: number | null;
  onChange?: () => void;
};

const FontSizeDropdown = ({ fontSize, onChange }: FontSizeDropdownPropsType) => {
  const dispatch = useDispatch();

  const status = useSelector((state: RootStateType) => state.designerState.designer.status);
  const zoom = useSelector((state: RootStateType) => state.designerState.designer.zoom);

  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );

  const textElement = useMemo(() => {
    const elementsWithText = Guard.getElementsWithText(selectedElements);
    if (!elementsWithText.length) return null;
    return elementsWithText[0];
  }, [selectedElements]);

  const [size, setSize] = useState(textElement.fontSize);

  useEffect(() => {
    if (fontSize) {
      setSize(fontSize);
    } else setSize(textElement.fontSize);
  }, [textElement.fontSize, fontSize]);

  const handleChange = (item: ActionDropdownItemType) => {
    if (!item.name) return;
    const newSize = +item.name;
    if (newSize) {
      if (status !== ElementStatuses.TextEditing) {
        const div = document.createElement('div');
        div.innerHTML = textElement.text;
        const list: NodeListOf<HTMLFontElement | HTMLSpanElement> = div.querySelectorAll('font[style], span[style]');
        list.forEach((element) => {
          element.style.fontSize = '';
          if (!element.style.length) {
            element.removeAttribute('style');
          }
        });
        const resized = ResizeManager.resizeText(
          textElement,
          null,
          textElement.align,
          div.innerHTML,
          newSize,
          textElement.fontFamily
        );
        commandUpdateTextSize(
          dispatch,
          {
            x: textElement.x,
            y: textElement.y,
            width: textElement.width,
            height: textElement.height,
            fontSize: textElement.fontSize,
          },
          {
            x: resized.x,
            y: resized.y,
            width: resized.width,
            height: resized.height,
            fontSize: newSize,
          },
          textElement.id,
          textElement.text,
          div.innerHTML
        );
      } else {
        sessionStorage.setItem('size', item.name);
        document.execCommand('fontSize', null, `${newSize * zoom}`);
        convertTextContent(textElement.id, item.name, zoom);
        onChange();
      }
    }
  };

  const selected = useMemo<ActionDropdownItemType>(
    () => ({
      name: `${size}`,
    }),
    [size]
  );

  const list: ActionDropdownItemType[] = sizes.map((size) => ({
    name: `${size}`,
  }));

  return (
    <ActionDropdown
      selected={selected}
      dropdownWidth={62}
      icon={<ArrowIcon className='svg-path-stroke' />}
      list={list}
      contentAfter='pt'
      buttonStyle={{ color: '#000000' }}
      onChange={handleChange}
    />
  );
};

export default FontSizeDropdown;
