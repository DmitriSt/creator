import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uniqid from 'uniqid';

import BackgroundColor from '../../../../../business/elements/BackgroundColor';
import BackgroundImage from '../../../../../business/elements/BackgroundImage';
import BaseElement from '../../../../../business/elements/BaseElement';
import designer from '../../../../../business/elements/Designer';
import QR from '../../../../../business/elements/QR';
import Text from '../../../../../business/elements/Text';
import * as Guard from '../../../../../business/Guard';
import { ReactComponent as MoveIcon } from '../../../../assets/images/designer/hamburger.svg';
import { ReactComponent as LockIcon } from '../../../../assets/images/designer/lock.svg';
import qrPlaceholder from '../../../../assets/images/designer/qr_placeholder.svg';
import checkLayers from '../../../../helpers/checkLayers';
import { commandChangeLayers } from '../../../../helpers/commands';
import { updateDesigner } from '../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../stores/store';
import styles from './canvasLayers.module.scss';

const CanvasLayers = () => {
  const dispatch = useDispatch();

  const activePage = useSelector((state: RootStateType) => state.designerState.designer.instance?.activePage);
  const activeCanvas = useSelector((state: RootStateType) => state.designerState.designer.instance?.activeCanvas);
  const isBgTransparent = useSelector(
    (state: RootStateType) =>
      state.designerState.product.pages[activePage]?.canvases[activeCanvas].backgroundOptions.isTransparent
  );
  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );
  const canvases = useSelector(
    (state: RootStateType) => state.designerState.designer.instance.pages[activePage].canvases
  );
  const overlapElements = useSelector((state: RootStateType) => state.designerState.designer.instance?.overlapElements);

  const [elementsReverse, setElementsReverse] = useState([]);
  const [isAllList, setIsAllList] = useState(true);
  const [dragEl, setDragEl] = useState({
    el: null,
    index: 0,
  });
  const [underEl, setUnderEl] = useState({
    el: null,
    index: 0,
  });

  const deps = useMemo(() => {
    const deps: string[] = [];
    canvases?.forEach((canvas) => canvas.elements.forEach((element) => deps.push(element.id)));
    return deps.join('');
  }, [canvases]);

  useLayoutEffect(() => {
    if (overlapElements.length && selectedElements.length) {
      setElementsReverse(overlapElements);
      setIsAllList(false);
    } else {
      const buffer = [...designer.getCurrentCanvas().elements];
      setElementsReverse(buffer.reverse());
      setIsAllList(true);
    }
  }, [deps, overlapElements, selectedElements]);

  useEffect(() => {
    if (dragEl.el) {
      designer.setSelectedElements([dragEl.el.id]);
      dispatch(updateDesigner(designer));
    }
  }, [dragEl.el]);

  const placeholder = (element: BaseElement) => {
    if (element instanceof QR) {
      return <img className={styles.qr} src={qrPlaceholder} alt='Placeholder' />;
    }
    const elementsWithText = Guard.getElementsWithText([element]);
    if (elementsWithText.length > 0) {
      const elementWithText = elementsWithText[0] as Text;
      const htmlElement = document.createElement('div');
      htmlElement.innerHTML = elementWithText.text;
      return (
        <div className={styles.text} style={{ color: elementWithText.color, fontFamily: elementWithText.fontFamily }}>
          {htmlElement.innerText.trim()}
        </div>
      );
    }
    const elementsWithImage = Guard.getElementsWithImage([element]);
    if (elementsWithImage.length > 0) {
      return <div className={styles.image} style={{ backgroundImage: `url(${elementsWithImage[0].source})` }} />;
    }
    const elementsWithColor = Guard.getElementsWithColor([element]);
    if (elementsWithColor.length > 0) {
      return <div className={styles.color} style={{ backgroundColor: `${elementsWithColor[0].color}` }} />;
    }
    return null;
  };

  const handleMouseUp = () => {
    if (dragEl.el && underEl.el) {
      if (underEl.index === elementsReverse.length - 1 && !overlapElements.length) return;

      setElementsReverse(elementsReverse);
      commandChangeLayers(dispatch, designer.getCurrentCanvas().elements, dragEl.el, underEl.el);
      setDragEl({ el: null, index: 0 });

      if (isAllList) {
        designer.overlapElements = [];
      } else {
        const layers = checkLayers(dragEl.el, designer.getCurrentCanvas().elements);
        designer.overlapElements = layers;
      }
      dispatch(updateDesigner(designer));
    }
  };

  const handleMouseDown = (element: BaseElement, index: number) => {
    setDragEl({ el: element, index });
    elementsReverse.splice(index, 1, element);
  };

  const handleMouseEnter = (element: BaseElement, index: number) => {
    if (!dragEl.el) return;

    setUnderEl({ el: element, index });

    if (index === elementsReverse.length - 1 && !overlapElements.length) return;

    elementsReverse.splice(dragEl.index, 1);
    elementsReverse.splice(index, 0, dragEl.el);
    setDragEl({ el: dragEl.el, index });
  };

  // const handleClick = (element: BaseElement) => {
  //   if (element instanceof BackgroundColor && isBgTransparent) return;
  //   designer.setSelectedElements([element.id]);
  //   dispatch(updateDesigner(designer));
  // };

  const preventBubbling = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    elementsReverse && (
      <div className={styles.list}>
        {overlapElements.length && selectedElements.length ? (
          <div className={`${styles.position} ${styles.top}`}>{`Overlapping elements (${overlapElements.length})`}</div>
        ) : (
          <>
            <div className={`${styles.position} ${styles.header}`}>All elements</div>
            <div className={styles.position}>top</div>
          </>
        )}
        <div className={styles.elements}>
          {elementsReverse.map((element: BaseElement, index) => (
            <div
              key={uniqid()}
              className={dragEl.el === element ? `${styles.element} ${styles.active}` : styles.element}
              onMouseEnter={() => handleMouseEnter(element, index)}
              onMouseUp={handleMouseUp}
              onMouseDown={preventBubbling}
              // onClick={() => handleClick(element)}
            >
              {element instanceof BackgroundImage || element instanceof BackgroundColor ? (
                <>
                  <div className={`${styles.elementInfo} ${styles.disabled}`}>
                    <div className={styles.elementPlaceholder}>{placeholder(element)}</div>
                    <div className={styles.elementName}>{element.elementName}</div>
                  </div>
                  <div className={`${styles.moveIcon} ${styles.disabled}`}>
                    <LockIcon />
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.elementInfo}>
                    <div className={styles.elementPlaceholder}>{placeholder(element)}</div>
                    <div className={styles.elementName}>{element.elementName}</div>
                  </div>
                  <div className={styles.moveIcon} onMouseDown={() => handleMouseDown(element, index)}>
                    <MoveIcon />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        {overlapElements.length && selectedElements.length ? (
          <div className={styles.bottom} />
        ) : (
          <div className={styles.position}>bottom</div>
        )}
      </div>
    )
  );
};

export default CanvasLayers;
