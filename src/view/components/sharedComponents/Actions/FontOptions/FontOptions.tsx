import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as Guard from '../../../../../business/Guard';
import { IElement } from '../../../../../business/interfaces/interfaces';
import ResizeManager from '../../../../../business/managers/ResizeManager';
import { ElementStatuses, TextAligns, TextStyles, TextViewStyles } from '../../../../../models/constants/designer';
import { commandUpdateTextAlign, commandUpdateTextValue } from '../../../../helpers/commands';
import { fireEvent, getSelectionStyles, setNodeSelection } from '../../../../helpers/textHelpers';
import { RootStateType } from '../../../../stores/store';
import AlignButton from './AlignButton/AlignButton';
import FontFamilyDropdown from './FontFamilyDropdown/FontFamilyDropdown';
import styles from './fontOptions.module.scss';
import FontSizeDropdown from './FontSizeDropdown/FontSizeDropdown';
import ToggleButton from './ToggleButton/ToggleButton';

type FontOptionsPropsType = {
  fontFamily?: boolean;
  fontSize?: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: boolean;
  colorCallback?: (color: string) => void;
};

const FontOptions = ({
  fontFamily = true,
  fontSize = true,
  bold = true,
  italic = true,
  underline = true,
  align = true,
  colorCallback,
}: FontOptionsPropsType) => {
  const dispatch = useDispatch();

  const status = useSelector((state: RootStateType) => state.designerState.designer.status);
  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );

  const [currentStyles, setCurrentStyles] = useState<TextViewStyles>({
    tags: [],
    styles: null,
  });

  useEffect(() => {
    if (currentStyles.styles) {
      colorCallback(currentStyles.styles.color);
    }
    return () => colorCallback('');
  }, [currentStyles]);

  const oldBounds = useRef<IElement>(null);

  const textElement = useMemo(() => {
    const elementsWithText = Guard.getElementsWithText(selectedElements);
    if (!elementsWithText.length) return null;
    return elementsWithText[0];
  }, [selectedElements]);

  useLayoutEffect(() => {
    if (status !== ElementStatuses.Stable) return;
    const selection = window.getSelection ? window.getSelection() : document.getSelection();
    selection.removeAllRanges();
    const testElement = document.createElement('div');
    testElement.innerHTML = textElement.text;
    testElement.setAttribute('contenteditable', 'true');
    document.body.appendChild(testElement);
    selection.selectAllChildren(testElement);
    setCurrentStyles(getSelectionStyles(selection, false));
    document.body.removeChild(testElement);
  }, [textElement, status]);

  let fixedNode = false;
  const handleSelectionChange = () => {
    const selection = document.getSelection();
    const element = document.getElementById(textElement?.id);
    if (!selection || !element) return;
    const focusElement = selection.focusNode as HTMLElement;
    fixedNode = fixedNode || focusElement === element;
    if (!fixedNode) return;
    const bubble = !focusElement.childNodes.length && !focusElement.id;
    setCurrentStyles(getSelectionStyles(selection, bubble));
  };

  const handleFontPropertyChange = useCallback(() => {
    handleSelectionChange();
    fireEvent();
  }, []);

  useEffect(() => {
    if (status === ElementStatuses.TextEditing) {
      oldBounds.current = textElement.bounds;
      fixedNode = true;
      document.addEventListener('selectionchange', handleSelectionChange);
    }
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [status]);

  const toggleStyle = useCallback(
    (style: TextStyles) => {
      if (textElement && status !== ElementStatuses.TextEditing) {
        const testElement = document.createElement('div');
        testElement.innerHTML = textElement.text;
        testElement.setAttribute('contenteditable', 'true');
        document.body.appendChild(testElement);
        setNodeSelection(testElement);
        document.execCommand(style, false, null);
        const resized = ResizeManager.resizeText(
          textElement,
          null,
          null,
          testElement.innerHTML,
          textElement.fontSize,
          textElement.fontFamily
        );
        commandUpdateTextValue(
          dispatch,
          {
            x: textElement.x,
            y: textElement.y,
            width: textElement.width,
            height: textElement.height,
            text: textElement.text,
            placeholder: textElement.placeholder,
          },
          {
            x: resized.x,
            y: resized.y,
            width: resized.width,
            height: resized.height,
            text: testElement.innerHTML,
            placeholder: textElement.placeholder,
          },
          textElement.id
        );
        document.body.removeChild(testElement);
        return;
      }
      document.execCommand(style, false, null);
    },
    [status, textElement]
  );

  const boldButton = <span className={styles.bold}>B</span>;
  const italicButton = <span className={styles.italic}>i</span>;
  const underlineButton = <span className={styles.underline}>U</span>;

  const toggleBold = () => toggleStyle(TextStyles.Bold);
  const toggleItalic = () => toggleStyle(TextStyles.Italic);
  const toggleUnderline = () => toggleStyle(TextStyles.Underline);

  const isBold = useMemo(() => currentStyles.tags.includes(TextStyles.Bold), [currentStyles]);
  const isItalic = useMemo(() => currentStyles.tags.includes(TextStyles.Italic), [currentStyles]);
  const isUnderline = useMemo(() => currentStyles.tags.includes(TextStyles.Underline), [currentStyles]);
  const textPartFontSize = useMemo(() => (currentStyles.styles ? currentStyles.styles.fontSize : null), [
    currentStyles,
  ]);
  const textPartFontFamily = useMemo(() => (currentStyles.styles ? currentStyles.styles.fontFamily : null), [
    currentStyles,
  ]);

  const toggleAlign = (prev: TextAligns, curr: TextAligns) =>
    commandUpdateTextAlign(dispatch, prev, curr, textElement.id);

  return (
    <div className={styles.options}>
      {fontFamily && <FontFamilyDropdown fontFamily={textPartFontFamily} onChange={handleFontPropertyChange} />}
      {fontSize && <FontSizeDropdown fontSize={textPartFontSize} onChange={handleFontPropertyChange} />}
      <div className={styles.toggles}>
        {bold && (
          <ToggleButton enabled={isBold} onToggle={toggleBold}>
            {boldButton}
          </ToggleButton>
        )}
        {italic && (
          <ToggleButton enabled={isItalic} onToggle={toggleItalic}>
            {italicButton}
          </ToggleButton>
        )}
        {underline && (
          <ToggleButton enabled={isUnderline} onToggle={toggleUnderline}>
            {underlineButton}
          </ToggleButton>
        )}
        {align && <AlignButton align={textElement?.align} onChange={toggleAlign} />}
      </div>
    </div>
  );
};

export default FontOptions;
