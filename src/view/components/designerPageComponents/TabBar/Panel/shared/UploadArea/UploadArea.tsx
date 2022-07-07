import React from 'react';
import { useSelector } from 'react-redux';

import { IUploadProps } from '../../../../../../../business/interfaces/interfaces';
import FilesManager from '../../../../../../../business/managers/FilesManager';
import ThumbnailManager from '../../../../../../../business/managers/ThumbnailManager';
import consts from '../../../../../../../models/constants/consts';
import uploadIcon from '../../../../../../assets/images/designer/uploadLarge.svg';
import { RootStateType } from '../../../../../../stores/store';
import styles from './uploadArea.module.scss';

const UploadArea = ({ callback, designId }: IUploadProps) => {
  const filesProgress = useSelector((state: RootStateType) => state.designerState.tabBar.filesProgress);

  const getFileContext = (e: any) => {
    const files = [...e.target.files];
    callback(files);
    ThumbnailManager.add(files);
    FilesManager.add(files, designId);
  };

  return (
    <div className={styles.uploadArea} style={filesProgress && filesProgress >= 0 ? { display: 'none' } : {}}>
      <img src={uploadIcon} alt='upload' />
      <span>Drop images here or</span>
      <input type='file' multiple accept={consts.uploadFiles.UPLOAD_TYPES} onChange={getFileContext} />
      <button type='button'>Browse</button>
    </div>
  );
};

export default UploadArea;
