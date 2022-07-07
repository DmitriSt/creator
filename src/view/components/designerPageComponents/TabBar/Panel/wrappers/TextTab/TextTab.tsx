import React from 'react';
import { useSelector } from 'react-redux';

import { IWithText } from '../../../../../../../business/interfaces/featuresInterfaces';
import consts from '../../../../../../../models/constants/consts';
import { Aligns } from '../../../../../../../models/constants/designer';
import { RootStateType } from '../../../../../../stores/store';
import TextTabElement from '../../elements/TabElement/TextTabElement';
import Overlay from '../../shared/Overlay/Overlay';
import styles from './textTab.module.scss';

const TextTab = () => {
  const activePage = useSelector((state: RootStateType) => state.designerState.designer.instance?.activePage);
  const activeCanvas = useSelector((state: RootStateType) => state.designerState.designer.instance?.activeCanvas);
  const textOptions = useSelector(
    (state: RootStateType) => state.designerState.product.pages[activePage]?.canvases[activeCanvas].textOptions
  );

  const heading: IWithText = {
    text: 'Add Heading',
    fontSize: 32,
    color: '#000000',
    align: Aligns.Center,
    placeholder: true,
    fontFamily: consts.designer.DEFAULT_FONT,
  };

  const subheading: IWithText = {
    text: 'Add a subheading',
    fontSize: 24,
    color: '#000000',
    align: Aligns.Center,
    placeholder: true,
    fontFamily: consts.designer.DEFAULT_FONT,
  };

  const caption: IWithText = {
    text: 'Add caption text',
    fontSize: 16,
    color: '#000000',
    align: Aligns.Center,
    placeholder: true,
    fontFamily: consts.designer.DEFAULT_FONT,
  };

  return textOptions.isAllowed ? (
    <>
      <div className={styles.title}>Drag & Drop to add text</div>
      <section className={styles.content}>
        <div style={{ marginBottom: 20 }}>
          <TextTabElement title='Heading' style={heading} />
        </div>
        <div style={{ marginBottom: 30 }}>
          <TextTabElement title='Subheading' style={subheading} />
        </div>
        <TextTabElement title='Caption' style={caption} />
      </section>
    </>
  ) : (
    <Overlay title='Text elements are not allowed on this canvas' />
  );
};

export default TextTab;
