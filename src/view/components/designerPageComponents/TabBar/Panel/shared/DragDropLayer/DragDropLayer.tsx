import cloneDeep from 'lodash.clonedeep';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BackgroundColor from '../../../../../../../business/elements/BackgroundColor';
import designer from '../../../../../../../business/elements/Designer';
import Image from '../../../../../../../business/elements/Image';
import QR from '../../../../../../../business/elements/QR';
import QREmail from '../../../../../../../business/elements/QREmail';
import QRMeCard from '../../../../../../../business/elements/QRMeCard';
import QRPhone from '../../../../../../../business/elements/QRPhone';
import QRVCard from '../../../../../../../business/elements/QRVCard';
import Text from '../../../../../../../business/elements/Text';
import createCanvasElements from '../../../../../../../business/factories/previewToElementFactory';
import { IWithColor, IWithImage, IWithText } from '../../../../../../../business/interfaces/featuresInterfaces';
import {
  IElement,
  IImageWrapper,
  ILayoutElement,
  IPosition,
} from '../../../../../../../business/interfaces/interfaces';
import consts from '../../../../../../../models/constants/consts';
import { ElementStatuses, TextTypes } from '../../../../../../../models/constants/designer';
import { BackgroundType } from '../../../../../../../models/designer/designer.models';
import {
  FormatTypes,
  MaintainedQRFormats,
  MeCardType,
  TextType,
  VCardType,
} from '../../../../../../../models/designer/qr.models';
import { TabDragDropComponents } from '../../../../../../../models/designer/tabBar.models';
import checkLayers from '../../../../../../helpers/checkLayers';
import { commandAddElement, commandChangeLayouts, commandReplaceElement } from '../../../../../../helpers/commands';
import { generateQRValue, maintainedQRFormat } from '../../../../../../helpers/qrValueHelpers';
import {
  setBackgroundEnter,
  setDraggableElement,
  setImageEnter,
  setImagesWrappers,
  setStatus,
  updateDesigner,
} from '../../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../../stores/store';
import QRTabElement from '../../elements/TabElement/QRTabElement';
import TextTabElement from '../../elements/TabElement/TextTabElement';
import DragDropElement from './DragDropElement/DragDropElement';
import styles from './dragDropLayer.module.scss';

const DragDropLayer = () => {
  const dispatch = useDispatch();

  const activePage = useSelector((state: RootStateType) => state.designerState.designer.instance?.activePage);
  const activeCanvas = useSelector((state: RootStateType) => state.designerState.designer.instance?.activeCanvas);
  const background = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.getCurrentCanvas().elements[0]
  ) as BackgroundColor;
  const draggableElement = useSelector((state: RootStateType) => state.designerState.designer.draggableElement);
  const coefficient = useSelector((state: RootStateType) => state.designerState.designer.coefficient);
  const zoom = useSelector((state: RootStateType) => state.designerState.designer.zoom);

  const backgroundOptions = useSelector(
    (state: RootStateType) => state.designerState.product.pages[activePage]?.canvases[activeCanvas].backgroundOptions
  );
  const pictureOptions = useSelector(
    (state: RootStateType) => state.designerState.product.pages[activePage].canvases[activeCanvas].pictureOptions
  );
  const textOptions = useSelector(
    (state: RootStateType) => state.designerState.product.pages[activePage].canvases[activeCanvas].textOptions
  );

  const imageEnter = useSelector((state: RootStateType) => state.designerState.tabBar.imageEnter);
  const imageHovered = useSelector((state: RootStateType) =>
    state.designerState.designer.instance?.getCurrentCanvas().elements.filter((element) => element.id === imageEnter)
  );
  const imagesOnCanvas = useSelector((state: RootStateType) => state.designerState.designer.imagesOnCanvas);
  const imagesWrappers = useSelector((state: RootStateType) => state.designerState.tabBar.imagesWrappers);

  const [position, setPosition] = useState<IPosition>();
  const [bgWrapLeft, setBgWrapLeft] = useState({});
  const [bgWrapRight, setBgWrapRight] = useState({});
  const [bgWrapTop, setBgWrapTop] = useState({});
  const [bgWrapBottom, setBgWrapBottom] = useState({});
  const [personalBG, setPersonalBG] = useState({});
  const [bgReplace, setBgReplace] = useState(false);

  const isRestricted =
    backgroundOptions.isTransparent ||
    (backgroundOptions.type === BackgroundType.COLOR && draggableElement.type === TabDragDropComponents.Image);

  useLayoutEffect(() => {
    document.body.classList.add('grabbing');
    return () => {
      document.body.classList.remove('grabbing');
    };
  }, []);

  const isImageFit = (width: number, height: number, bounds: IElement) => {
    return width >= bounds.width && height >= bounds.height;
  };

  const createPersonalBGWrapper = (position: IPosition) => {
    const canvas = document.getElementById('canvas-main');
    if (!canvas) throw new Error('Canvas instance not found');
    const bounds = canvas.getBoundingClientRect();

    if (position) {
      setPersonalBG({
        top: bounds.top,
        left: bounds.left,
        width: `${bounds.width}px`,
        height: `${bounds.height}px`,
      });
    }
  };

  const createBGWrapper = (position: IPosition) => {
    const canvas = document.getElementById('canvas-main');
    if (!canvas) throw new Error('Canvas instance not found');
    const bounds = canvas.getBoundingClientRect();
    const zone = consts.designer.BACKGROUND_DROP_ZONE_PADDING;

    if (position) {
      setBgWrapLeft({
        top: bounds.top - zone * coefficient,
        left: bounds.x - zone * coefficient,
        width: `${zone * 2 * coefficient}px`,
        height: bounds.bottom - bounds.top + zone * 2 * coefficient,
      });
      setBgWrapRight({
        top: bounds.top - zone * coefficient,
        left: bounds.x + bounds.width - zone * coefficient,
        width: `${zone * 2 * coefficient}px`,
        height: bounds.bottom - bounds.top + zone * 2 * coefficient,
      });
      setBgWrapTop({
        top: bounds.top - zone * coefficient,
        left: bounds.x - zone * coefficient,
        right: bounds.right + zone * coefficient,
        width: bounds.right - bounds.left,
        height: `${zone * 2 * coefficient}px`,
      });
      setBgWrapBottom({
        top: bounds.top + bounds.height - zone * coefficient,
        left: bounds.x - zone * coefficient,
        right: bounds.right + zone * coefficient,
        width: bounds.right - bounds.left,
        height: `${zone * 2 * coefficient}px`,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
    if (draggableElement.type === TabDragDropComponents.Image) {
      const image = draggableElement.payload as IWithImage;
      const isFit = isImageFit(image.originalWidth, image.originalHeight, background.bounds);
      if (isFit && !isRestricted) {
        createBGWrapper(position);
      }
    } else if (
      (draggableElement.type === TabDragDropComponents.Background ||
        draggableElement.type === TabDragDropComponents.Color) &&
      !(
        backgroundOptions.isTransparent ||
        (draggableElement.type === TabDragDropComponents.Background && backgroundOptions.type === BackgroundType.COLOR)
      )
    ) {
      createPersonalBGWrapper(position);
    }
  };

  const handleBgEnter = () => {
    setBgReplace(true);
    dispatch(setBackgroundEnter(true));
    setPosition({
      x: 0,
      y: 0,
    });
  };

  const handleBgLeave = () => {
    setBgReplace(false);
    dispatch(setBackgroundEnter(false));
  };

  const handleImageEnter = (e: React.MouseEvent, image: IImageWrapper) => {
    dispatch(setImageEnter(image.id));
  };

  const handleImageLeave = () => {
    dispatch(setImageEnter(''));
  };

  const getQRValue = (
    qrType: MaintainedQRFormats,
    value: MeCardType | VCardType | TextType
  ): null | MeCardType | VCardType | TextType => {
    const activeCanvasSide = designer.getCurrentCanvas();
    if (!activeCanvasSide || !activeCanvasSide.elements) return null;
    const textElemsMap = new Map<keyof typeof TextTypes, Text>();
    activeCanvasSide.elements.forEach((el) => {
      if (el instanceof Text && !el.placeholder) {
        textElemsMap.set(el.textType, cloneDeep(el));
      }
    });
    if (textElemsMap.size === 0) return null;
    return generateQRValue<typeof value>(qrType, textElemsMap, value);
  };

  const handleMouseUp = () => {
    setBgReplace(false);
    dispatch(setStatus(ElementStatuses.Stable));
    dispatch(setImageEnter(''));
    dispatch(setBackgroundEnter(false));
    dispatch(setDraggableElement(null));
    dispatch(setImagesWrappers([]));
    if (draggableElement && position) {
      let elementType = draggableElement.type;
      if (bgReplace) {
        if (
          draggableElement.type === TabDragDropComponents.Background ||
          draggableElement.type === TabDragDropComponents.Image
        ) {
          elementType = TabDragDropComponents.Background;
        } else {
          elementType = TabDragDropComponents.Color;
        }
      }
      const elements = createCanvasElements({
        type: elementType,
        payload: draggableElement.payload,
        position: {
          ...position,
          coefficient,
        },
        bgReplace,
        zoom,
      });
      if (!elements || elements.length === 0) return;
      if (draggableElement.type === TabDragDropComponents.Text && !textOptions.isAllowed) return;
      if (
        (draggableElement.type === TabDragDropComponents.Image && bgReplace) ||
        draggableElement.type === TabDragDropComponents.Background ||
        draggableElement.type === TabDragDropComponents.Color
      ) {
        if (
          backgroundOptions.isTransparent ||
          (backgroundOptions.type === BackgroundType.COLOR && draggableElement.type !== TabDragDropComponents.Color)
        ) {
          return;
        }
        commandReplaceElement(dispatch, background, elements[0]);
      } else if (draggableElement.type === TabDragDropComponents.Image && imageHovered.length) {
        const imgHover = imageHovered[0] as Image;
        const el = elements[0] as Image;
        el.height = imgHover.height;
        el.width = imgHover.width;
        el.x = imgHover.x;
        el.y = imgHover.y;
        el.rotation = imgHover.rotation;
        commandReplaceElement(dispatch, imageHovered[0], el);
      } else if (draggableElement.type === TabDragDropComponents.Layout) {
        commandChangeLayouts(dispatch, designer.getCurrentCanvas().elements, elements);
      } else if (draggableElement.type === TabDragDropComponents.QR) {
        const el = elements[0] as QR;
        if (maintainedQRFormat.includes(el.format)) {
          const qrElement = el as QRMeCard | QRVCard | QREmail | QRPhone;
          const qrValue = getQRValue(el.format as MaintainedQRFormats, qrElement.value);
          if (qrValue) {
            qrElement.value = { ...qrElement.value, ...qrValue };
          }
        }
        commandAddElement(dispatch, el);
        const layers = checkLayers(el, designer.getCurrentCanvas().elements);
        designer.isLayers = !!layers;
        designer.overlapElements = layers;
        dispatch(updateDesigner(designer));
      } else if (draggableElement.type === TabDragDropComponents.Image && imagesOnCanvas === pictureOptions.maxCount) {
        // console.log('LIMIT!');
      } else {
        commandAddElement(dispatch, elements[0]);
        const layers = checkLayers(elements[0], designer.getCurrentCanvas().elements);
        designer.isLayers = !!layers;
        designer.overlapElements = layers;
        dispatch(updateDesigner(designer));
      }
    }
  };

  const element = useMemo(() => {
    if (!draggableElement) return null;
    switch (draggableElement.type) {
      case TabDragDropComponents.QR:
        return <QRTabElement type={draggableElement.payload as FormatTypes} />;
      case TabDragDropComponents.Text:
        return <TextTabElement style={draggableElement.payload as IWithText} />;
      case TabDragDropComponents.Background:
        return <img src={(draggableElement.payload as IWithImage).thumbUrl} alt='Place it on canvas' />;
      case TabDragDropComponents.Template:
        return <img src={(draggableElement.payload as IWithImage).thumbUrl} alt='Place it on canvas' />;
      case TabDragDropComponents.Layout:
        return <img src={(draggableElement.payload as ILayoutElement).url} alt='Place it on canvas' />;
      case TabDragDropComponents.Sticker:
        return (
          <img
            src={(draggableElement.payload as IWithImage).thumbUrl}
            className={styles.dragImage}
            alt='Place it on canvas'
          />
        );
      case TabDragDropComponents.Image:
        return <img src={(draggableElement.payload as IWithImage).thumbUrl} alt='Place it on canvas' />;
      case TabDragDropComponents.Color:
        return (
          <div className={styles.color} style={{ backgroundColor: (draggableElement.payload as IWithColor).color }} />
        );
      default:
        throw new Error('Unknown type of draggable element');
    }
  }, [draggableElement]);

  return (
    draggableElement && (
      <div className={styles.dragDropLayer} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
        <div
          className={styles.bgWrapper}
          style={personalBG}
          onMouseEnter={handleBgEnter}
          onMouseLeave={handleBgLeave}
        />
        <div
          className={styles.bgWrapper}
          style={bgWrapLeft}
          onMouseEnter={handleBgEnter}
          onMouseLeave={handleBgLeave}
        />
        <div
          className={styles.bgWrapper}
          style={bgWrapRight}
          onMouseEnter={handleBgEnter}
          onMouseLeave={handleBgLeave}
        />
        <div className={styles.bgWrapper} style={bgWrapTop} onMouseEnter={handleBgEnter} onMouseLeave={handleBgLeave} />
        <div
          className={styles.bgWrapper}
          style={bgWrapBottom}
          onMouseEnter={handleBgEnter}
          onMouseLeave={handleBgLeave}
        />
        {imagesWrappers.map((image) => (
          <div
            key={image.id}
            className={imageEnter === image.id ? `${styles.imagesWrappers} ${styles.active}` : styles.imagesWrappers}
            onMouseEnter={(e) => handleImageEnter(e, image)}
            onMouseLeave={handleImageLeave}
            style={{
              top: `${image.y * zoom - (image.height * zoom) / 2}px`,
              left: `${image.x * zoom - (image.width * zoom) / 2}px`,
              width: `${image.width * zoom - 3}px`,
              height: `${image.height * zoom - 3}px`,
              transform: image.transform,
            }}
          />
        ))}
        {position && (
          <DragDropElement
            element={draggableElement.type}
            position={position}
            isBgEnter={bgReplace && !isRestricted}
            isImageReplace={imageEnter}
          >
            {element}
          </DragDropElement>
        )}
      </div>
    )
  );
};

export default DragDropLayer;
