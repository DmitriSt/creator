import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import designer from '../../../../business/elements/Designer';
import { IPageConfig } from '../../../../business/interfaces/interfaces';
import backPreview from '../../../assets/images/designer/backPreview.svg';
import brush from '../../../assets/images/designer/brush.svg';
import preview from '../../../assets/images/designer/preview.svg';
import { saveDesigner } from '../../../helpers/commands';
import { setShowPreview, updateDesigner } from '../../../stores/designerStore/designer/designerActions';
import { setStrongLayersShow } from '../../../stores/designerStore/toolbar/toolbarActions';
import LoginAvatar from '../../authorizationComponents/LoginAvatar';
import Button from '../../sharedComponents/Button/Button';
import AddDesignToCartButton from './AddDesignToCartButton/AddDesignToCartButton';
import styles from './header.module.scss';

type HeaderPropsType = {
  config: IPageConfig;
  isShowPreview: boolean;
};

const Header = ({ config, isShowPreview }: HeaderPropsType) => {
  const dispatch = useDispatch();

  const [projectName, setProjectName] = useState(designer.projectName);
  const [changeProjectName, setChangeProjectName] = useState(false);

  const inputRef = useRef(null);

  const getWidthOfInput = () => {
    const tmp = document.createElement('span');
    tmp.innerHTML = inputRef.current.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    document.body.appendChild(tmp);
    const theWidth = tmp.getBoundingClientRect().width;
    document.body.removeChild(tmp);
    return theWidth - 20;
  };

  const adjustWidthOfInput = () => {
    if (inputRef.current) inputRef.current.style.width = `${getWidthOfInput()}px`;
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      adjustWidthOfInput();
    }
  }, [changeProjectName]);

  const handleChangeName = (e: React.ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value;
    if (value.length <= 80) setProjectName(value);
  };

  const handleSaveCNamehange = () => {
    setChangeProjectName(false);
    if (projectName !== designer.projectName && projectName.length) {
      designer.projectName = projectName;
      dispatch(updateDesigner(designer));
      saveDesigner();
    } else {
      setProjectName(designer.projectName);
    }
  };

  const handleChangePreview = () => {
    designer.overlapElements = [];
    designer.isLayers = false;
    designer.clearSelectedElements();
    dispatch(setStrongLayersShow(false));
    dispatch(updateDesigner(designer));
    dispatch(setShowPreview(!isShowPreview));
  };

  return (
    !!config?.showHeader && (
      <div className={styles.header}>
        <div className={styles.properties}>
          <Link to='/'>
            <div className={styles.logo}>EP</div>
          </Link>
          <div className={styles.description}>
            <span className={styles.title}>Project Name</span>
            <input
              style={{ display: `${changeProjectName ? 'block' : 'none'}` }}
              className={styles.projectInput}
              type='text'
              value={projectName}
              onBlur={handleSaveCNamehange}
              onChange={(e) => handleChangeName(e)}
              onKeyUp={adjustWidthOfInput}
              ref={inputRef}
            />
            <span id='projectName' className={styles.project} style={{ display: changeProjectName ? 'none' : 'block' }}>
              {projectName}
            </span>
            {!changeProjectName && (
              <span onClick={() => setChangeProjectName(!changeProjectName)} className={styles.projectNameIcon}>
                <img src={brush} alt='Change name' />
              </span>
            )}
          </div>
        </div>
        <div className={styles.controls}>
          {config.showSignIn && <LoginAvatar />}
          {config.showPreview && (
            <Button
              className={isShowPreview ? `${styles.previewButton} ${styles.preview}` : styles.previewButton}
              image={isShowPreview ? backPreview : preview}
              variant='outlined'
              color='inverted'
              value={isShowPreview ? 'Back to Edit' : 'Preview'}
              onClick={handleChangePreview}
            />
          )}
          {config.showAddToCart && (
            <AddDesignToCartButton
              className={styles.addToCartButton}
              isShowPreview={isShowPreview}
              showPreview={handleChangePreview}
            />
          )}
        </div>
      </div>
    )
  );
};

export default Header;
