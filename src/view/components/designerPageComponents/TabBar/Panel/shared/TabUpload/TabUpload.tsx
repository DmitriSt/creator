import React from 'react';

import { IUploadProps } from '../../../../../../../business/interfaces/interfaces';
import FilesManager from '../../../../../../../business/managers/FilesManager';
import ThumbnailManager from '../../../../../../../business/managers/ThumbnailManager';
import consts from '../../../../../../../models/constants/consts';
import { ReactComponent as UploadIcon } from '../../../../../../assets/images/designer/uploadSmall.svg';
import styles from './tabUpload.module.scss';

const TabUpload = ({ callback, designId }: IUploadProps) => {
  const getFileContext = (e: any) => {
    const files = [...e.target.files];
    callback(files);
    ThumbnailManager.add(files);
    FilesManager.add(files, designId);
  };

  return (
    <div className={styles.uploadItems}>
      <div className={styles.uploadItem}>
        <UploadIcon className='svg-path-stroke' />
        <span>Device</span>
        <input type='file' multiple accept={consts.uploadFiles.UPLOAD_TYPES} onChange={getFileContext} />
      </div>
    </div>
  );
};

export default TabUpload;
