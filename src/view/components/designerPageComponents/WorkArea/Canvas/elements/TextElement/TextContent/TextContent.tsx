import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import designer from '../../../../../../../../business/elements/Designer';
import Text from '../../../../../../../../business/elements/Text';
import { IElement } from '../../../../../../../../business/interfaces/interfaces';
import ResizeManager from '../../../../../../../../business/managers/ResizeManager';
import consts from '../../../../../../../../models/constants/consts';
import { ElementStatuses } from '../../../../../../../../models/constants/designer';
import { commandUpdateTextValue } from '../../../../../../../helpers/commands';
import { convertTextContent, setNodeSelection, zoomTextContent } from '../../../../../../../helpers/textHelpers';
import { setStatus, updateDesigner } from '../../../../../../../stores/designerStore/designer/designerActions';
import styles from './textContent.module.scss';

type TextContentPropsType = {
  element: Text;
  zoom: number;
  editable?: boolean;
};

const TextContent = ({ element, zoom, editable = false }: TextContentPropsType) => {
  const dispatch = useDispatch();

  const prevElement = useRef<Text>(element);
  const actualText = useRef<string>(null);
  const actualBounds = useRef<IElement>(null);

  const [text, setText] = useState(element.text);

  useEffect(() => {
    if (editable) setNodeSelection(document.getElementById(element.id));
  }, [editable]);

  const zoomedText = useMemo(() => zoomTextContent(element.text, zoom), [element.text, zoom]);

  useLayoutEffect(() => {
    if (text === element.text) return;
    const resized = ResizeManager.resizeText(element, null, element.align, text, element.fontSize, element.fontFamily);
    actualText.current = text;
    actualBounds.current = resized.bounds;
    if (element.width !== resized.width || element.height !== resized.height) {
      const designerElement = designer.getElementById(element.id) as Text;
      designerElement.bounds = {
        x: resized.x,
        y: resized.y,
        width: resized.width,
        height: resized.height,
      };
      designerElement.manuallyResized = resized.manuallyResized;
      dispatch(updateDesigner(designer));
    }
  }, [text]);

  useLayoutEffect(() => {
    actualText.current = element.text;
    actualBounds.current = element.bounds;
    return () => {
      if (prevElement.current.text === actualText.current) return;
      const emptyTextElement = ResizeManager.resizeText(
        element,
        null,
        element.align,
        consts.designer.EMPTY_TEXT,
        element.fontSize,
        element.fontFamily
      );
      commandUpdateTextValue(
        dispatch,
        {
          x: prevElement.current.x,
          y: prevElement.current.y,
          width: prevElement.current.width,
          height: prevElement.current.height,
          text: prevElement.current.text,
          placeholder: prevElement.current.placeholder,
        },
        {
          x: actualBounds.current.x,
          y: actualBounds.current.y,
          width: actualText.current ? actualBounds.current.width : emptyTextElement.width,
          height: actualText.current ? actualBounds.current.height : emptyTextElement.height,
          text: actualText.current || consts.designer.EMPTY_TEXT,
          placeholder: !actualText.current,
        },
        element.id
      );
    };
  }, []);

  const getText = (innerHTML: string) => {
    const size = sessionStorage.getItem('size');
    sessionStorage.removeItem('size');
    if (size && +size) {
      return convertTextContent(element.id, size, 1);
    }
    return innerHTML;
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target) setText(target.innerHTML !== '<br>' ? getText(target.innerHTML) : '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      dispatch(setStatus(ElementStatuses.Stable));
      return;
    }
    e.stopPropagation();
    if (!element.checker(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    document.execCommand('insertText', false, text);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const style = useMemo<React.CSSProperties>(() => {
    return {
      WebkitUserSelect: editable ? 'text' : 'none',
      userSelect: editable ? 'text' : 'none',
      fontFamily: element.fontFamily,
      fontSize: `${element.fontSize * zoom}pt`,
      color: element.color,
      maxWidth: element.width * zoom,
    };
  }, [element, zoom]);

  return (
    <div
      id={element.id}
      className={styles.editable}
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      onPaste={handlePaste}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: zoomedText }}
      contentEditable={editable}
    />
  );
};

export default TextContent;
