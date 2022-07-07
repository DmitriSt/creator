import React from 'react';

import { ReactComponent as EditIcon } from '../../../assets/images/designer/brush.svg';
import ActionButton from '../../sharedComponents/Actions/ActionButton/ActionButton';
import DesignInstructions from '../DesignInstructions/DesignInstructions';
import ProductProperties from '../ProductProperties/ProductProperties';
import Sides from '../Sides/Sides';
import styles from './pageContent.module.scss';

const PageContent = () => {
  const edit = () => {
    console.log('edit');
  };
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Upload Artwork</h1>
      <div className={styles.label}>
        <p>My Business card 10/10/2020</p>
        <ActionButton onClick={edit} icon={<EditIcon className={styles.edit_icon} />} />
      </div>
      <div className={styles.content}>
        <Sides />
        <ProductProperties />
        <DesignInstructions />
      </div>
    </div>
  );
};

export default PageContent;
