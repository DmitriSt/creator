import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uniqid from 'uniqid';

import { ICardInfo, PaymentProvider, PaymentType } from '../../../../../models/checkout.models';
import { ReactComponent as AmericanEexpress } from '../../../../assets/images/cart/american_express.svg';
import { ReactComponent as Maestro } from '../../../../assets/images/cart/maestro.svg';
import { ReactComponent as Mastercard } from '../../../../assets/images/cart/mastercard.svg';
import { ReactComponent as Visa } from '../../../../assets/images/cart/visa.svg';
import { applyCardCCVMask, applyCardExpirationDateMask, applyCardNumberMask } from '../../../../helpers/inputMasks';
import { updateCard, updatePaymentStatus, updateProvider } from '../../../../stores/checkoutStore/user/userActions';
import { RootStateType } from '../../../../stores/store';
import TextField from '../../../cartPageComponents/TextField/TextField';
import RadioButton from '../../../sharedComponents/RadioButton/RadioButton';
import styles from './payWays.module.scss';

const images = [Visa, Mastercard, Maestro, AmericanEexpress];

const PayWays = () => {
  const dispatch = useDispatch();
  const providers = useSelector((state: RootStateType) => state.checkoutState.checkout.payment.providers);
  const { provider, card } = useSelector((state: RootStateType) => state.checkoutState.user.payment);
  const [errorText, setErrorText] = useState('');

  const updatePayWay = (item: PaymentProvider) => {
    dispatch(updatePaymentStatus(false));
    dispatch(updateProvider(item));
  };

  useEffect(() => {
    if (!provider) {
      updatePayWay(providers[0]);
    }
  }, [provider]);

  const validateExpDate = (val: string) => {
    const date = new Date();
    const fullYear = date.getFullYear();
    const year = fullYear % 100;
    const limitYear = year + 10;
    const month = date.getMonth() + 1;
    const [cardMonth, cardYear] = val.split('/');
    if (+cardYear < year || +cardYear > limitYear) {
      setErrorText('Invalid expiraton date');
      return;
    }
    if (+cardMonth < month && +cardYear === year) {
      setErrorText('Invalid expiraton date');
    }
  };

  const updateCardInfo = (id: keyof ICardInfo, val: string) => {
    if (card[id] === val) return;
    dispatch(updatePaymentStatus(false));
    dispatch(
      updateCard({
        ...card,
        [id]: val,
      })
    );
  };

  const applyCCVMask = (val: string) => {
    const newVal = applyCardCCVMask(val);
    if (!newVal && !card.ccv) {
      return newVal;
    }
    updateCardInfo('ccv', newVal);
    return newVal;
  };

  const applyNumberMask = (val: string) => {
    const newVal = applyCardNumberMask(val);
    if (!newVal && !card.number) {
      return newVal;
    }
    updateCardInfo('number', newVal);
    return newVal;
  };

  const applyExpirationDateMask = (val: string) => {
    if (errorText && val.length < 5) setErrorText('');
    const newVal = applyCardExpirationDateMask(val);
    if (!newVal && !card.expirationDate) {
      return newVal;
    }
    updateCardInfo('expirationDate', newVal);
    if (newVal.length === 5 && !errorText) {
      validateExpDate(newVal);
    }
    return newVal;
  };

  const updateOwnerName = (val: string) => updateCardInfo('ownerName', val);

  return (
    <>
      <div className={styles.pay_ways}>
        {providers &&
          providers.map((item, index) => {
            return (
              <RadioButton
                key={item.provider}
                name='pay'
                id={item.provider}
                label={item.provider}
                checked={provider ? item.provider === provider.provider : index === 0}
                callback={() => updatePayWay(item)}
                className={styles.radio_button}
              />
            );
          })}
      </div>
      {provider && provider.type === PaymentType.DIRECT_PAY && (
        <>
          <div className={styles.card_icons}>
            {images.map((item) => {
              const Component = item;
              return (
                <div key={uniqid()} className={styles.img_wrapper}>
                  <Component />
                </div>
              );
            })}
          </div>
          <div className={styles.card_info}>
            <TextField
              initialValue={card.number}
              className={styles.long_field}
              placeholder='Card Number'
              inputMaskApplayer={applyNumberMask}
            />
            <TextField
              errorText={errorText}
              initialValue={card.expirationDate}
              placeholder='Expiraton Date MM/YY'
              inputMaskApplayer={applyExpirationDateMask}
            />
            <TextField initialValue={card.ccv} placeholder='CCV' inputMaskApplayer={applyCCVMask} />
            <TextField
              initialValue={card.ownerName}
              className={styles.long_field}
              placeholder='Card Owner Name'
              onInput={updateOwnerName}
            />
          </div>
        </>
      )}
    </>
  );
};

export default PayWays;
