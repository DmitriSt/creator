import React, { useState } from 'react';

import { validateEmail } from '../../../../../helpers/checkoutHelpers';
import TextField from '../../../../cartPageComponents/TextField/TextField';

type EmailFieldPropsType = {
  callback: (value: string) => void;
  initialValue: string;
};

const EmailField = ({ initialValue, callback }: EmailFieldPropsType) => {
  const [isValid, setIsValid] = useState(true);

  const checkEmail = (value: string) => {
    const isValid = validateEmail(value);
    setIsValid(isValid);
  };

  const updateEmail = (value: string) => {
    setIsValid(true);
    callback(value);
  };

  return (
    <TextField
      errorText={isValid ? '' : 'Please, enter valid email'}
      initialValue={initialValue}
      id='email'
      onBlur={checkEmail}
      onInput={updateEmail}
      placeholder='Email'
    />
  );
};

export default EmailField;
