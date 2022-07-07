import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { RootStateType } from '../../../../../../stores/store';
import styles from './progressUpload.module.scss';

interface IProgressUploadProps {
  files: File[];
  chunksComplete: number;
  countChunks: number;
}

const ProgressUpload = ({ files, chunksComplete, countChunks }: IProgressUploadProps) => {
  const filesProgress = useSelector((state: RootStateType) => state.designerState.tabBar.filesProgress);
  const newThumbnails = useSelector((state: RootStateType) => state.designerState.tabBar.newThumbnails);

  const progressByChunks = 100 / countChunks;

  const [displayProgress, setDisplayProgress] = useState(true);

  useEffect(() => {
    setDisplayProgress(!!newThumbnails.length);
  }, [filesProgress, newThumbnails]);

  return (
    <div className={styles.progressWrapper} style={!files.length || !displayProgress ? { display: 'none' } : null}>
      <div className={styles.progress} style={{ width: `${progressByChunks * chunksComplete}%` }} />
      <div className={styles.content}>
        <span className={styles.uploadText}>Uploading Images </span>
        {filesProgress || 0}
        <span>/</span>
        {files.length}
      </div>
    </div>
  );
};

export default ProgressUpload;
