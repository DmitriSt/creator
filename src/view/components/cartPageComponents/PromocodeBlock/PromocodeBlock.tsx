import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { applyPromocode } from '../../../../services/cart.service';
import { ReactComponent as Success } from '../../../assets/images/check.svg';
import { updateStoreCart } from '../../../stores/cartStore/cart/cartActions';
import { RootStateType } from '../../../stores/store';
import Button from '../../sharedComponents/Button/Button';
import TextField from '../TextField/TextField';
import styles from './promocodeBlock.module.scss';

const PromocodeBlock = () => {
  const dispatch = useDispatch();
  const campaing = useSelector((state: RootStateType) => state.appState.config.campaignConfig);
  if (!campaing.isRunning) return null;

  const [isSuccess, setIsSuccess] = useState(false);
  const [promocode, setPromocode] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updatePromocode = (value: string) => {
    setPromocode(value);
    if (errorText) {
      setErrorText('');
    }
    if (isSuccess) {
      setIsSuccess(false);
    }
  };

  const activatePromocode = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      // await new Promise((res) => setTimeout(() => res('asd'), 4000000));
      const cart = await applyPromocode(promocode);
      if (cart) {
        dispatch(updateStoreCart(cart));
        setIsSuccess(true);
        setPromocode('');
        return;
      }
      setErrorText('This promo code is not valid');
    } catch (err) {
      setErrorText('This promo code is not valid');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TextField
      className={isLoading && styles.disabled}
      errorText={errorText}
      initialValue={promocode}
      onInput={updatePromocode}
      placeholder={campaing.name}
      defaultStyles={styles.text}
    >
      {!isSuccess && !errorText && (
        <Button
          onClick={activatePromocode}
          color='secondary'
          className={styles.button}
          value='apply'
          isLoading={isLoading}
        />
      )}
      {isSuccess && <Success className='svg-path-stroke' />}
    </TextField>
  );
};

export default PromocodeBlock;
