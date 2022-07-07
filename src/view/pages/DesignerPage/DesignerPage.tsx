import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import WebFont from 'webfontloader';

import designer from '../../../business/elements/Designer';
import createDesigner from '../../../business/factories/configToDesignerFactory';
import getFullDesigner from '../../../business/services/DesignerService';
import { availableFonts, ElementStatuses } from '../../../models/constants/designer';
import { DesignerModel } from '../../../models/designer/designer.models';
import {
  createBlankDesign,
  getDesignerProductConfig,
  getUserDesign,
} from '../../../services/designer/designer.service';
import { checkSession, restoreSession } from '../../../services/session.service';
import Header from '../../components/designerPageComponents/Header/Header';
import TabBar from '../../components/designerPageComponents/TabBar/TabBar';
import ToolBar from '../../components/designerPageComponents/ToolBar/ToolBar';
import Controls from '../../components/designerPageComponents/WorkArea/Controls/Controls';
import WorkArea from '../../components/designerPageComponents/WorkArea/WorkArea';
import Loader from '../../components/sharedComponents/Loader/Loader';
import NotFoundStub from '../../components/sharedComponents/NotFoundStub/NotFoundStub';
import { addDisabledCanvases } from '../../helpers/designer';
import useDesignerURL from '../../hooks/useDesignerURL';
import resetStoreState from '../../stores/actions';
import {
  setMainConfig,
  setShowPreview,
  setStatus,
  updateDesigner,
} from '../../stores/designerStore/designer/designerActions';
import setProduct from '../../stores/designerStore/product/productActions';
import { setStrongLayersShow } from '../../stores/designerStore/toolbar/toolbarActions';
import { RootStateType } from '../../stores/store';
import styles from './designerPage.module.scss';

const DesignerPage = () => {
  const dispatch = useDispatch();
  const { replace } = useHistory();
  const [designId, productId] = useDesignerURL();

  const mainConfig = useSelector((state: RootStateType) => state.designerState.designer.mainConfig);
  const zoom = useSelector((state: RootStateType) => state.designerState.designer.zoom);
  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );
  const isShowPreview = useSelector((state: RootStateType) => state.designerState.designer.isShowPreview);

  const [isLoaded, setLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const deps = selectedElements?.map((element) => element.id).join('');

  const getDesign = (designId: string, productId: number) => {
    if (!designId && productId && +productId && !Number.isNaN(+productId)) {
      return createBlankDesign(+productId);
    }
    return getUserDesign(designId);
  };

  useEffect(() => {
    designer.clearSelectedElements();
    dispatch(updateDesigner(designer));
    dispatch(setShowPreview(false));
    (async () => {
      let design: DesignerModel | null = null;
      try {
        if (!designId) {
          await checkSession();
        } else {
          await restoreSession(designId);
        }
        design = await getDesign(designId, productId);
        if (!design) {
          setIsError(true);
          return;
        }
      } catch (error: any) {
        if (
          error &&
          (error.status === 400 || error.message === 'Network Error' || error.message === 'Design not found')
        ) {
          setIsError(true);
        }
        return;
      }
      if (design && !designId) replace(`/designer/${design.designId}`);
      const productConfig = await getDesignerProductConfig(design ? design.productId : +productId);
      const designer = createDesigner(design);
      if (productConfig) {
        addDisabledCanvases(productConfig, designId);
      }
      const designerData = await getFullDesigner(productConfig.productId);
      dispatch(setMainConfig(designerData));
      dispatch(setProduct(productConfig));
      designer.isLayers = false;
      designer.overlapElements = [];
      dispatch(setStrongLayersShow(false));
      WebFont.load({
        custom: {
          families: availableFonts.map((font) => `${font}:n4,i4,n7,i7`),
        },
      });
      dispatch(updateDesigner(designer));
      setLoaded(true);
    })();
    return () => {
      dispatch(resetStoreState());
    };
  }, []);

  const preventDefault = (e: React.UIEvent) => {
    e.preventDefault();
  };

  const handleMouseDown = useCallback(() => {
    if (selectedElements.length > 0) {
      designer.clearSelectedElements();
      designer.overlapElements = [];
      dispatch(updateDesigner(designer));
      dispatch(setStatus(ElementStatuses.Stable));
    }
  }, [deps]);

  if (isError) return <NotFoundStub />;

  return isLoaded ? (
    <div
      className={styles.designer}
      onContextMenu={preventDefault}
      onDragStart={preventDefault}
      onDragEnd={preventDefault}
    >
      <Header config={mainConfig?.pageConfig} isShowPreview={isShowPreview} />
      <div className={styles.container}>
        <TabBar isShowPreview={isShowPreview} />
        <div className={styles.workarea_wrapper}>
          {!isShowPreview && (
            <div className={styles.toolbar}>
              <ToolBar />
            </div>
          )}
          <div
            className={`${isShowPreview ? styles.workarea_inner_wrapper_full_height : styles.workarea_inner_wrapper}`}
          >
            <div
              id='scrollable_work_area'
              className={`${styles.workarea} ${zoom === 1 ? styles.overflow_hidden : ''}`}
              onMouseDown={handleMouseDown}
            >
              <WorkArea isShowPreview={isShowPreview} />
            </div>
            {!isShowPreview && <Controls />}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default DesignerPage;
