import React, { useState } from 'react';

import { ReactComponent as Location } from '../../../../../assets/images/location.svg';
import TextField from '../../../../cartPageComponents/TextField/TextField';
import styles from './mapSearch.module.scss';

const MapSearch = () => {
  const [address, setAddress] = useState('');

  const updateAddress = (val: string) => {
    setAddress(val);
    console.log(val);
  };
  return (
    <TextField onBlur={updateAddress} className={styles.field}>
      <Location />
    </TextField>
  );
};

export default MapSearch;
