import React, { useRef } from 'react';
import { useSelector } from 'react-redux';

import { TabSettings, TabTools } from '../../../../../models/designer/tabBar.models';
import { RootStateType } from '../../../../stores/store';
import styles from './panel.module.scss';
import DragDropLayer from './shared/DragDropLayer/DragDropLayer';
import AvailableCanvasToggler from './wrappers/AvailableCanvasToggler/AvailableCanvasToggler';
import BackgroundsTab from './wrappers/BackgroundsTab/BackgroundsTab';
import FavouritesTab from './wrappers/FavouritesTab/FavouritesTab';
import ImagesTab from './wrappers/ImagesTab/ImagesTab';
import LayoutsTab from './wrappers/LayoutsTab/LayoutsTab';
import QRTab from './wrappers/QRTab/QRTab';
import StickersTab from './wrappers/StickersTab/StickersTab';
import TemplatesTab from './wrappers/TemplatesTab/TemplatesTab';
import TextTab from './wrappers/TextTab/TextTab';

const Panel = () => {
  const activeTab = useSelector((state: RootStateType) => state.designerState.tabBar.activeTab);
  const draggableElement = useSelector((state: RootStateType) => state.designerState.designer.draggableElement);

  const panelRef = useRef(null);

  return (
    <section ref={panelRef} className={styles.panel} style={{ display: activeTab ? 'block' : 'none' }} id='tab-panel'>
      {draggableElement && <DragDropLayer />}

      {/* <Resizer reference={panelRef} className={styles.resizer}> */}
      {/*  <div className={styles.line} /> */}
      {/*  <div className={styles.line} /> */}
      {/* </Resizer> */}

      {activeTab === TabTools.Templates && <TemplatesTab />}
      {activeTab === TabTools.Layouts && <LayoutsTab />}
      {activeTab === TabTools.Images && <ImagesTab />}
      {activeTab === TabTools.Backgrounds && <BackgroundsTab />}
      {activeTab === TabTools.Clipart && <StickersTab />}
      {activeTab === TabTools.QR && <QRTab />}
      {activeTab === TabTools.Text && <TextTab />}
      {activeTab === TabTools.Favourites && <FavouritesTab />}
      {activeTab === TabSettings.ProductSettings && <AvailableCanvasToggler />}
    </section>
  );
};

export default Panel;
