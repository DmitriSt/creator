import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Guard from '../../../../../../business/Guard';
import ResizeManager from '../../../../../../business/managers/ResizeManager';
import { ElementStatuses, TextFontType } from '../../../../../../models/constants/designer';
import { ReactComponent as ArrowIcon } from '../../../../../assets/images/designer/arrow.svg';
import { commandUpdateTextFamily } from '../../../../../helpers/commands';
import { RootStateType } from '../../../../../stores/store';
import ActionDropdown, { ActionDropdownItemType } from '../../ActionDropdown/ActionDropdown';

type FontFamilyDropdownPropsType = {
  fontFamily?: string | null;
  onChange?: () => void;
};

const FontFamilyDropdown = ({ fontFamily, onChange }: FontFamilyDropdownPropsType) => {
  const dispatch = useDispatch();

  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );
  const fontsRaw = useSelector((state: RootStateType) => state.designerState.product.fonts);

  const status = useSelector((state: RootStateType) => state.designerState.designer.status);

  const fonts = useMemo(() => fontsRaw.sort((a, b) => (a.text > b.text ? 1 : -1)), [fontsRaw]);

  const textElement = useMemo(() => {
    const elementsWithText = Guard.getElementsWithText(selectedElements);
    if (!elementsWithText.length) return null;
    return elementsWithText[0];
  }, [selectedElements]);

  const [family, setFamily] = useState<TextFontType>(null);

  useEffect(() => {
    if (fontFamily) {
      setFamily(fontFamily as TextFontType);
    } else setFamily(textElement.fontFamily);
  }, [textElement.fontFamily, fontFamily]);

  const handleChange = (item: ActionDropdownItemType) => {
    if (!item.itemStyle.fontFamily) return;
    const newFamily = item.itemStyle.fontFamily as TextFontType;
    if (newFamily) {
      if (status !== ElementStatuses.TextEditing) {
        const div = document.createElement('div');
        div.innerHTML = textElement.text;
        const list = div.querySelectorAll('font');
        list.forEach((fontElement) => {
          if (fontElement.face) {
            fontElement.removeAttribute('face');
          }
        });
        const resized = ResizeManager.resizeText(
          textElement,
          null,
          textElement.align,
          div.innerHTML,
          textElement.fontSize,
          newFamily
        );
        commandUpdateTextFamily(
          dispatch,
          {
            x: textElement.x,
            y: textElement.y,
            width: textElement.width,
            height: textElement.height,
            fontFamily: textElement.fontFamily,
          },
          {
            x: resized.x,
            y: resized.y,
            width: resized.width,
            height: resized.height,
            fontFamily: newFamily,
          },
          textElement.id,
          textElement.text,
          div.innerHTML
        );
      } else {
        document.execCommand('fontName', null, newFamily);
        onChange();
      }
    }
  };

  const selected = useMemo<ActionDropdownItemType>(
    () => ({
      name: fonts.find((font) => font.normal === family)?.text || family,
      itemStyle: { fontFamily: family },
    }),
    [family]
  );

  const list: ActionDropdownItemType[] = fonts.map((font) => ({
    name: font.text,
    itemStyle: { fontFamily: font.normal },
  }));

  return (
    <ActionDropdown
      selected={selected}
      dropdownWidth={140}
      icon={<ArrowIcon className='svg-path-stroke' />}
      list={list}
      buttonStyle={{ color: '#000000', fontFamily: family }}
      onChange={handleChange}
    />
  );
};

export default FontFamilyDropdown;
