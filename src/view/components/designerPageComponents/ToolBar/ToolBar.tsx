import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import history from '../../../../business/commands/History';
import designer from '../../../../business/elements/Designer';
import { ElementStatuses } from '../../../../models/constants/designer';
import { ReactComponent as Redo } from '../../../assets/images/designer/redo.svg';
import { ReactComponent as Undo } from '../../../assets/images/designer/undo.svg';
import checkLayers from '../../../helpers/checkLayers';
import { saveDesigner } from '../../../helpers/commands';
import { updateDesigner } from '../../../stores/designerStore/designer/designerActions';
import { setStrongLayersShow, setToolbarShow } from '../../../stores/designerStore/toolbar/toolbarActions';
import { RootStateType } from '../../../stores/store';
import Actions from '../../sharedComponents/Actions/Actions';
import Switch from '../../sharedComponents/Switch/Switch';
import styles from './toolBar.module.scss';

const ToolBar = () => {
  const dispatch = useDispatch();

  const selectedElements = useSelector(
    (state: RootStateType) => state.designerState.designer.instance?.selectedElements
  );
  const status = useSelector((state: RootStateType) => state.designerState.designer.status);
  const isLayers = useSelector((state: RootStateType) => state.designerState.designer.instance?.isLayers);
  const strongLayersShow = useSelector((state: RootStateType) => state.designerState.toolbar.strongLayersShow);

  const [undoDisabled, setUndoDisabled] = useState(false);
  const [redoDisabled, setRedoDisabled] = useState(false);

  const [isActionsTitled, setActionsTitled] = useState(true);

  const [toolbarBorderedWidth, setToolbarBorderedWidths] = useState(0);

  const toolbarRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const deps = useMemo(() => selectedElements?.map((element) => element.id).join(''), [selectedElements]);

  useEffect(() => {
    setUndoDisabled(history.activeIndex <= -1);
    setRedoDisabled(history.activeIndex >= history.commandsList.length - 1);
  }, [history.activeIndex, history.commandsList.length]);

  useEffect(() => {
    dispatch(setStrongLayersShow(isLayers));
  }, [isLayers]);

  const handleUndo = async () => {
    designer.clearSelectedElements();
    await history.undo();
    dispatch(updateDesigner(designer));
    saveDesigner();
  };

  const handleRedo = async () => {
    designer.clearSelectedElements();
    await history.redo();
    dispatch(updateDesigner(designer));
    saveDesigner();
  };

  const disableToolbar = () => {
    dispatch(setToolbarShow(false));
  };

  const enableToolbar = () => {
    dispatch(setToolbarShow(true));
  };

  const disableLayers = () => {
    designer.isLayers = false;
    designer.overlapElements = [];
    dispatch(updateDesigner(designer));
  };

  const enableLayers = () => {
    if (designer.selectedElements[0]) {
      const layers = checkLayers(designer.selectedElements[0], designer.getCurrentCanvas().elements);
      designer.overlapElements = layers;
    } else {
      designer.overlapElements = [];
    }
    designer.isLayers = true;
    dispatch(updateDesigner(designer));
  };

  const actions = useMemo(() => (selectedElements?.length ? <Actions fixed titled={isActionsTitled} /> : null), [
    deps,
    isActionsTitled,
  ]);
  const className = useMemo(
    () => (status === ElementStatuses.CroppingMode ? `${styles.toolbar} ${styles.disabled}` : styles.toolbar),
    [status]
  );

  useEffect(() => {
    setActionsTitled(true);
  }, [deps]);

  useEffect(() => {
    if (!isActionsTitled || !toolbarRef.current) return;
    const childrenArray = Array.from(toolbarRef.current.children);
    const childrenWidth = childrenArray.reduce((width, child) => width + child.getBoundingClientRect().width, 0);
    setToolbarBorderedWidths(childrenWidth);
  }, [isActionsTitled, deps]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const toolbarWidth =
        entries && entries[0] && entries[0].contentBoxSize && entries[0].contentBoxSize[0]
          ? entries[0].contentBoxSize[0].inlineSize
          : 0;
      setActionsTitled(toolbarWidth > toolbarBorderedWidth);
    });
    if (toolbarRef.current) resizeObserver.observe(toolbarRef.current);
    return () => {
      if (toolbarRef.current) resizeObserver.unobserve(toolbarRef.current);
    };
  }, [toolbarBorderedWidth, deps]);

  return (
    <div className={className} ref={toolbarRef}>
      <div className={styles.stepper}>
        <div className={undoDisabled ? `${styles.step} ${styles.disabled}` : styles.step} onClick={handleUndo}>
          <Undo className='svg-path-stroke' />
          <span className={styles.title}>Undo</span>
        </div>
        <div className={redoDisabled ? `${styles.step} ${styles.disabled}` : styles.step} onClick={handleRedo}>
          <Redo className='svg-path-stroke' />
          <span className={styles.title}>Redo</span>
        </div>
      </div>
      <div className={styles.actions} ref={actionsRef}>
        {actions}
      </div>
      <div className={styles.switchers}>
        <Switch title='Toolbar' onEnable={enableToolbar} onDisable={disableToolbar} withStatus={false} />
        <Switch
          title='Layers'
          checked={strongLayersShow}
          onEnable={enableLayers}
          onDisable={disableLayers}
          withStatus={false}
        />
      </div>
    </div>
  );
};

export default ToolBar;
