import React, { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import designer from '../../../../business/elements/Designer';
import QR from '../../../../business/elements/QR';
import { getRotatables } from '../../../../business/Guard';
import { IPosition } from '../../../../business/interfaces/interfaces';
import { ElementStatuses, grabbingStatuses } from '../../../../models/constants/designer';
import { FloatingPanelPositionType } from '../../../../models/designer/designer.models';
import { rotateByAxes, toRadian } from '../../../helpers/utils';
import { updateDesigner } from '../../../stores/designerStore/designer/designerActions';
import { RootStateType } from '../../../stores/store';
import Actions from '../../sharedComponents/Actions/Actions';
import FloatingPanel from '../../sharedComponents/FloatingPanel/FloatingPanel';
import CropZoomPanel from '../../sharedComponents/FloatingPanel/panels/CropZoomPanel/CropZoomPanel';
import QRSettingsPanel from '../../sharedComponents/FloatingPanel/panels/QRSettingsPanel/QRSettingsPanel';
import Canvas from './Canvas/Canvas';
import CanvasLayers from './CanvasLayers/CanvasLayers';
import ColorPaletteWrapper from './ColorPaletteWrapper/ColorPaletteWrapper';
import Thumbnails from './Thumbnails/Thumbnails';
import styles from './workArea.module.scss';

const FLOATING_MARGIN = 20;

interface IWorkAreaProps {
  isShowPreview: boolean;
}

const WorkArea = ({ isShowPreview }: IWorkAreaProps) => {
  const dispatch = useDispatch();

  const zoom = useSelector((state: RootStateType) => state.designerState.designer.zoom);
  const strongLayersShow = useSelector((state: RootStateType) => state.designerState.toolbar.strongLayersShow);
  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance.selectedElements
  );
  const coefficient = useSelector((state: RootStateType) => state.designerState.designer.coefficient);
  const isShowToolbar = useSelector((state: RootStateType) => state.designerState.toolbar.toolbarShow);
  const status = useSelector((state: RootStateType) => state.designerState.designer.status);

  useLayoutEffect(() => {
    if (grabbingStatuses.includes(status)) {
      document.body.classList.add('grabbing');
    } else {
      document.body.classList.remove('grabbing');
    }
  }, [status]);

  const actions = useMemo(() => {
    if (!selectedElements.length) return null;
    if (status === ElementStatuses.CroppingMode) return <CropZoomPanel />;
    if (selectedElements[0] instanceof QR) return <QRSettingsPanel />;
    return isShowToolbar ? <Actions fixed={false} /> : null;
  }, [status, selectedElements, isShowToolbar]);

  const underSelectedElementsPosition = useMemo<IPosition>(() => {
    const canvasDom = document.getElementById('canvas-main');
    if (selectedElements?.length === 0 || !canvasDom) return { x: 0, y: 0 };
    const activeElement = selectedElements[0];
    const rotation = getRotatables(selectedElements)[0]?.rotation || 0;
    const canvasBounds = canvasDom.getBoundingClientRect();
    const x0 = (activeElement.width * zoom) / 2;
    const y0 = (activeElement.height * zoom) / 2;
    const vertices: IPosition[] = [
      { x: -x0, y: -y0 },
      { x: x0, y: -y0 },
      { x: x0, y: y0 },
      { x: -x0, y: y0 },
    ];
    const rotatedVertices = vertices.map((vertice) => rotateByAxes(vertice, toRadian(rotation)));
    const lowestVertice = Math.max(...rotatedVertices.map((vertice) => vertice.y));
    return {
      x: activeElement.x * zoom * coefficient + canvasBounds.x,
      y: (activeElement.y * zoom + lowestVertice) * coefficient + canvasBounds.y + FLOATING_MARGIN,
    };
  }, [coefficient, zoom, selectedElements]);

  const floatingToolbarPosition = useMemo<FloatingPanelPositionType>(() => {
    return {
      left: `${underSelectedElementsPosition.x}px - 50%`,
      top: `${underSelectedElementsPosition.y}px`,
    };
  }, [underSelectedElementsPosition]);

  const canvasLayersPosition: FloatingPanelPositionType = {
    left: '200px - 100%',
    top: '-1px',
  };

  const canvasLayers = useMemo(() => {
    return strongLayersShow ? <CanvasLayers /> : null;
  }, [strongLayersShow]);

  const handleCanvasLayersClose = () => {
    designer.isLayers = false;
    designer.overlapElements = [];
    dispatch(updateDesigner(designer));
  };

  return (
    <div id='work-area' className={`${styles.workArea} ${zoom > 1 && styles.zoomed}`}>
      <div className={`${styles.canvasSection} ${zoom > 1 && styles.zoomed}`}>
        <div className={styles.canvas}>
          <div
            className={zoom <= 1 ? styles.content_wrapper_adaptive : styles.content_wrapper}
            style={{ pointerEvents: isShowPreview ? 'none' : 'all' }}
          >
            {!isShowPreview && (
              <>
                <FloatingPanel
                  targetId='canvas-thumbnails'
                  initial={canvasLayersPosition}
                  style={{ background: '#EEF3F5' }}
                  onClose={handleCanvasLayersClose}
                  isResetPosition={!strongLayersShow}
                >
                  {canvasLayers}
                </FloatingPanel>
                <FloatingPanel
                  isResetPosition={!isShowToolbar}
                  invisibleStatuses={[ElementStatuses.Moving, ElementStatuses.Rotating]}
                  initial={floatingToolbarPosition}
                >
                  {actions}
                </FloatingPanel>
                <ColorPaletteWrapper position={underSelectedElementsPosition} />
              </>
            )}
            <Canvas />
          </div>
        </div>
        <Thumbnails />
      </div>
    </div>
  );
};

export default WorkArea;
