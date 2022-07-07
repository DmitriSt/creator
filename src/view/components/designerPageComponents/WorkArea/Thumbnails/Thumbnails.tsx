import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import uniqid from 'uniqid';

import designer from '../../../../../business/elements/Designer';
import Page from '../../../../../business/elements/Page';
import consts from '../../../../../models/constants/consts';
import { RootStateType } from '../../../../stores/store';
import Thumbnail from './Thumbnail/Thumbnail';
import styles from './thumbnails.module.scss';

const Thumbnails = () => {
  const pages = useSelector((state: RootStateType) => state.designerState.designer.instance?.pages);
  const activePage = useSelector((state: RootStateType) => state.designerState.designer.instance?.activePage);
  const activeCanvas = useSelector((state: RootStateType) => state.designerState.designer.instance?.activeCanvas);
  const zoom = useSelector((state: RootStateType) => state.designerState.designer.zoom);

  const canvases = designer.getAllCanvases();

  const deps = useMemo(() => {
    const deps: string[] = [];
    canvases.forEach((canvas) => canvas.elements.forEach((element) => deps.push(element.id)));
    return deps.join('');
  }, [pages]);

  const statuses = useMemo(() => {
    const statuses: boolean[] = [];
    canvases.forEach((canvas) => statuses.push(canvas.disabled));
    return statuses.join('');
  }, [pages]);

  const isHasPositions = () => {
    let hasPosition = false;
    pages.forEach((page) => {
      page.canvases.forEach((canvas) => {
        if (canvas.left || canvas.top) hasPosition = true;
      });
    });
    return hasPosition;
  };

  const heightPage = (page: Page) => {
    const coefficient = page.width / page.height;
    return consts.thumbnails.MAX_WIDTH * coefficient;
  };

  return useMemo(
    () => (
      <div className={`${styles.thumbnails} ${zoom !== 1 && styles.sticky}`} id='canvas-thumbnails'>
        {pages?.map((page, index) => (
          <div key={uniqid()} className={styles.thumbnailWrap}>
            {isHasPositions() && page.backgroundUrl && (
              <img
                src={page.backgroundUrl}
                alt='pageImage'
                className={styles.bgImage}
                style={{ width: `${consts.thumbnails.MAX_WIDTH}px`, height: `${heightPage(page)}px` }}
              />
            )}
            {isHasPositions() && !page.backgroundUrl && (
              <div
                className={styles.bgImage}
                style={{ width: `${consts.thumbnails.MAX_WIDTH}px`, height: `${heightPage(page)}px` }}
              />
            )}
            {page.canvases.map((canvas, i) => (
              <Thumbnail key={uniqid()} pageIndex={index} page={page} canvasIndex={i} canvas={canvas} />
            ))}
            <div className={styles.thumbnailCanvases}>
              <>
                {page.canvases.map((canvas, i) => (
                  <span key={uniqid()} className={index === activePage && i === activeCanvas ? styles.nameActive : ''}>
                    {canvas.name}
                  </span>
                ))}
              </>
            </div>
          </div>
        ))}
      </div>
    ),
    [deps, statuses, pages?.length, zoom, activePage, activeCanvas]
  );
};

export default Thumbnails;
