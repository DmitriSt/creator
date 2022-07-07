import React, { CSSProperties, useCallback, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import uniqid from 'uniqid';

import QR from '../../../../business/elements/QR';
import Text from '../../../../business/elements/Text';
import * as Guard from '../../../../business/Guard';
import { ElementFeatures } from '../../../../models/constants/designer';
import placeholderImage from '../../../assets/images/designer/placeholderImageGrey.svg';
import qrPlaceholder from '../../../assets/images/designer/qr_placeholder.svg';
import { RootStateType } from '../../../stores/store';
import styles from './actions.module.scss';
import ColorFillButton from './ColorFillButton/ColorFillButton';
import DeleteButton from './DeleteButton/DeleteButton';
import FiltersButton from './FiltersButton/FiltersDropdown';
import FlipDropdown from './FlipDropdown/FlipDropdown';
import FontOptions from './FontOptions/FontOptions';
import UseAsBackgroundButton from './UseAsBackgroundButton/UseAsBackgroundButton';
import UseAsImageButton from './UseAsImageButton/UseAsImageButton';
import ZoomCropButton from './ZoomCropButton/ZoomCropButton';

type ActionsPropsType = {
  fixed: boolean;
  titled?: boolean;
};

const Actions = ({ fixed, titled = true }: ActionsPropsType) => {
  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );

  const [currentColor, setCurrentColor] = useState('');

  const toolsRef = useRef<HTMLDivElement>(null);

  const deps = useMemo(() => selectedElements?.map((element) => element.id).join(''), [selectedElements]);

  const activeElement = useMemo(() => selectedElements && selectedElements[0], [deps]);

  const toolsOrder = [
    ElementFeatures.Filterable,
    ElementFeatures.Croppable,
    ElementFeatures.Flippable,
    ElementFeatures.Colorable,
    ElementFeatures.Textable,
    ElementFeatures.UsableAsImage,
    ElementFeatures.UsableAsBackground,
  ];

  const applySelectedTextColor = useCallback((color: string) => setCurrentColor(color), []);

  const rawTools = useMemo(() => {
    return toolsOrder
      .map((orderTool) => {
        if (activeElement && activeElement.features.includes(orderTool)) {
          switch (orderTool) {
            case ElementFeatures.UsableAsImage:
              return <UseAsImageButton key={uniqid()} titled={titled} />;
            case ElementFeatures.Filterable:
              return <FiltersButton key={uniqid()} titled={titled} />;
            case ElementFeatures.Colorable:
              return 'colorFillButton';
            case ElementFeatures.Flippable:
              return <FlipDropdown key={uniqid()} titled={titled} />;
            case ElementFeatures.Croppable:
              return <ZoomCropButton key={uniqid()} titled={titled} />;
            case ElementFeatures.UsableAsBackground:
              return <UseAsBackgroundButton key={uniqid()} titled={titled} />;
            case ElementFeatures.Textable:
              return <FontOptions key={uniqid()} colorCallback={applySelectedTextColor} />;
            default:
              throw new Error('Unknown element feature');
          }
        }
        return null;
      })
      .filter((tool) => tool)
      .concat(<DeleteButton key={uniqid()} titled={titled} />);
  }, [activeElement, titled]);

  const tools = useMemo(() => {
    return rawTools.map((item) => {
      if (item === 'colorFillButton') {
        return (
          <ColorFillButton
            titled={titled && !activeElement.features.includes(ElementFeatures.Textable)}
            color={currentColor}
            key={uniqid()}
          />
        );
      }
      return item;
    });
  }, [currentColor, rawTools]);

  const placeholder = useMemo(() => {
    if (!selectedElements || selectedElements?.length === 0) return null;
    if (selectedElements[0] instanceof QR) {
      return <img className={styles.qr} src={qrPlaceholder} alt='Placeholder' />;
    }
    const elementsWithText = Guard.getElementsWithText(selectedElements);
    if (elementsWithText.length > 0) {
      const elementWithText = elementsWithText[0] as Text;
      const htmlElement = document.createElement('div');
      htmlElement.innerHTML = elementWithText.text;
      return (
        <div
          className={styles.text}
          title={htmlElement.innerText.trim()}
          style={{ color: elementWithText.color, fontFamily: elementWithText.fontFamily }}
        >
          {htmlElement.innerText.trim()}
        </div>
      );
    }
    const elementsWithImage = Guard.getElementsWithImage(selectedElements);
    if (elementsWithImage.length > 0) {
      return <img src={elementsWithImage[0].source || placeholderImage} alt='Placeholder' />;
    }
    const elementsWithColor = Guard.getElementsWithColor(selectedElements);
    if (elementsWithColor.length > 0) {
      return <div className={styles.color} style={{ backgroundColor: `${elementsWithColor[0].color}` }} />;
    }
    return null;
  }, [selectedElements]);

  const placeholderStyle = useMemo<CSSProperties>(
    () => (fixed ? { padding: '7px 8px 7px 4px' } : { padding: '7px 10px 7px 7px' }),
    [fixed]
  );

  const placeholderElementName = useMemo(
    () =>
      fixed &&
      !(selectedElements[0] instanceof Text) && <span className={styles.name}>{selectedElements[0].elementName}</span>,
    [fixed, selectedElements]
  );

  const actions = (
    <div className={styles.actions}>
      <div className={styles.selection}>
        {fixed && <span className={styles.title}>Selection:</span>}
        <div className={styles.placeholder} style={placeholderStyle}>
          {placeholder}
        </div>
        {placeholderElementName}
      </div>
      <div className={styles.toolsWrapper}>
        <div ref={toolsRef} className={styles.tools}>
          {tools}
        </div>
      </div>
    </div>
  );

  return activeElement ? actions : null;
};

export default Actions;
