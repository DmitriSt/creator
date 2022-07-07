import QRCode from 'qrcode.react';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import designer from '../../../../../../../business/elements/Designer';
import QR from '../../../../../../../business/elements/QR';
import * as Guard from '../../../../../../../business/Guard';
import { IDimension, IPosition } from '../../../../../../../business/interfaces/interfaces';
import QRStringifyVisitor from '../../../../../../../business/visitors/QRStringifyVisitor';
import consts from '../../../../../../../models/constants/consts';
import { DesignerElementType } from '../../../../../../../models/designer/designer.models';
import checkLayers from '../../../../../../helpers/checkLayers';
import { updateDesigner } from '../../../../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../../../../stores/store';
import { withMove } from '../../hocs/withMove';

const QRElement = ({ id, thumbnail }: DesignerElementType) => {
  const dispatch = useDispatch();

  const zoom = thumbnail ? 1 : useSelector((state: RootStateType) => state.designerState.designer.zoom);
  const element = useSelector((state: RootStateType) =>
    state.designerState.designer.instance.getElementById(id)
  ) as QR<unknown>;

  const canvasElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance.getCurrentCanvas().elements
  );

  const translateWrapper = useMemo<string>(() => {
    if (!element) return '';
    const newX = (element.x - element.width / 2) * zoom;
    const newY = (element.y - element.height / 2) * zoom;
    return `translate(${newX} ${newY})`;
  }, [element, zoom]);

  const rotateWrapper = useMemo<string>(() => {
    if (!Guard.isRotatable(element) || element.rotation === 0) return '';
    return `rotate(${element.rotation} ${(element.width * zoom) / 2} ${(element.height * zoom) / 2})`;
  }, [element, zoom]);

  const scaleImage = useMemo(() => {
    if (!element) return null;
    const padding = Math.min(Math.max(element.width, element.height) * 0.05, consts.designer.QR_BORDER_MAX_WIDTH);
    const scale = 1 - (2 * padding) / element.width;
    return `translate(${padding} ${padding}) scale(${scale})`;
  }, [element]);

  const transformWrapper = useMemo(() => `${translateWrapper} ${rotateWrapper}`, [translateWrapper, rotateWrapper]);

  const leftTop = useMemo<IPosition>(() => {
    if (!element) return null;
    return {
      x: element.x - element.width / 2,
      y: element.y - element.height / 2,
    };
  }, [element, zoom]);

  const viewbox = useMemo(() => {
    if (!element || !leftTop) return null;
    return `0 0 ${element.width} ${element.height}`;
  }, [element]);

  const dimensions = useMemo<IDimension>(() => {
    if (!element) return { width: 0, height: 0 };
    return {
      width: element.width * zoom,
      height: element.height * zoom,
    };
  }, [element, zoom]);

  const handleMouseDown = () => {
    if (!element && thumbnail) return;
    designer.setSelectedElements([element.id]);
    const layers = checkLayers(element, canvasElements);
    designer.isLayers = !!layers.length;
    designer.overlapElements = layers;
    dispatch(updateDesigner(designer));
  };

  const image = useMemo(() => {
    if (!element) return null;
    const visitor = new QRStringifyVisitor();
    const value = element.value ? element.visit(visitor) : '';
    return (
      <>
        <rect width={element.width} height={element.height} fill='#FFFFFF' rx='5' ry='5' />
        <g transform={scaleImage}>
          <QRCode
            value={value}
            width={element.width}
            height={element.height}
            preserveAspectRatio='none'
            bgColor='#FFFFFF'
            renderAs='svg'
            fgColor={element.color}
          />
        </g>
      </>
    );
  }, [element, scaleImage]);

  return (
    <g transform={transformWrapper} onMouseDown={handleMouseDown}>
      <svg id={id} width={dimensions.width} height={dimensions.height} viewBox={viewbox} style={{ display: 'block' }}>
        {image}
      </svg>
    </g>
  );
};

const WrappedQRElement = withMove(QRElement);

export default WrappedQRElement;
