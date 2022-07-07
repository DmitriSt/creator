import React, { ChangeEvent, InputHTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import QR from '../../../../../../../business/elements/QR';
import { EmailType, MeCardType, TextType, VCardType } from '../../../../../../../models/designer/qr.models';
import { commandUpdateQR } from '../../../../../../helpers/commands';
import styles from './settingsForm.module.scss';

type SettingsFormPropsType = {
  element: QR;
};

const SettingsForm = ({ element }: SettingsFormPropsType) => {
  const dispatch = useDispatch();
  const isTrigger = useRef(false);

  const [state, setState] = useState(element.value);

  const currentElement = useRef<QR>(element);
  const currentState = useRef(state);

  const preventDefault = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  const stopPropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const handleUpdate = (isNotSelectQR = false) => {
    isTrigger.current = false;
    const prevValue = element.value;
    element.value = currentState.current;
    if (element && prevValue && element.value) {
      commandUpdateQR(dispatch, prevValue, element.value, element.id, isNotSelectQR);
    }
  };

  const handleBlur = () => handleUpdate();

  useEffect(() => {
    return () => {
      if (isTrigger.current) {
        handleUpdate(true);
      }
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    stopPropagation(e);
    if (e.key === 'Enter') {
      handleUpdate();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    const propertyName = e.target.dataset.property;
    if (propertyName !== undefined) {
      isTrigger.current = true;
      setState((state: Record<string, unknown>) => ({
        ...state,
        [propertyName]: target.value,
      }));
    }
  };

  useEffect(() => {
    currentElement.current = element;
    setState(element.value);
  }, [element]);

  useEffect(() => {
    currentState.current = state;
  }, [state]);

  const InputField = (props: InputHTMLAttributes<HTMLInputElement>): JSX.Element => (
    <input
      type='text'
      onChange={handleInputChange}
      onKeyDown={stopPropagation}
      onKeyPressCapture={handleKeyPress}
      {...props}
    />
  );

  const vCardForm = () => {
    const vCard = state as VCardType;
    return (
      <>
        <InputField placeholder='First Name' data-property='firstName' defaultValue={vCard.firstName} />
        <InputField placeholder='Last Name' data-property='lastName' defaultValue={vCard.lastName} />
        <InputField placeholder='Email' data-property='email' defaultValue={vCard.email} />
        <InputField placeholder='Company' data-property='company' defaultValue={vCard.company} />
        <InputField placeholder='Title' data-property='title' defaultValue={vCard.title} />
        <InputField placeholder='Phone Nr.' data-property='phone' defaultValue={vCard.phone} />
        <InputField placeholder='Address 1' data-property='address1' defaultValue={vCard.address1} />
        <InputField placeholder='Address 2' data-property='address2' defaultValue={vCard.address2} />
        <InputField placeholder='City' data-property='city' defaultValue={vCard.city} />
        <InputField placeholder='State' data-property='state' defaultValue={vCard.state} />
        <InputField placeholder='Postal Code' data-property='postalCode' defaultValue={vCard.postalCode} />
        <InputField placeholder='Country' data-property='country' defaultValue={vCard.country} />
        <InputField placeholder='Website' data-property='website' defaultValue={vCard.website} />
      </>
    );
  };

  const meCardForm = () => {
    const meCard = state as MeCardType;
    return (
      <>
        <InputField placeholder='First Name' data-property='firstName' defaultValue={meCard.firstName} />
        <InputField placeholder='Last Name' data-property='lastName' defaultValue={meCard.lastName} />
        <InputField placeholder='Email' data-property='email' defaultValue={meCard.email} />
        <InputField placeholder='Phone Nr.' data-property='phone' defaultValue={meCard.phone} />
        <InputField placeholder='Address 1' data-property='address1' defaultValue={meCard.address1} />
        <InputField placeholder='Address 2' data-property='address2' defaultValue={meCard.address2} />
        <InputField placeholder='City' data-property='city' defaultValue={meCard.city} />
        <InputField placeholder='State' data-property='state' defaultValue={meCard.state} />
        <InputField placeholder='Postal Code' data-property='postalCode' defaultValue={meCard.postalCode} />
        <InputField placeholder='Country' data-property='country' defaultValue={meCard.country} />
      </>
    );
  };

  const textForm = () => {
    const form = state as TextType;
    return <InputField placeholder={currentElement.current.format} data-property='text' defaultValue={form.text} />;
  };

  const emailForm = () => {
    const form = state as EmailType;
    return (
      <>
        <InputField placeholder='Email' data-property='email' defaultValue={form.email} />
      </>
    );
  };

  const form = useMemo(() => {
    switch (currentElement.current.format) {
      case 'VCard':
        return vCardForm();
      case 'MeCard':
        return meCardForm();
      case 'Email':
        return emailForm();
      case 'Text':
      case 'URL':
      case 'Phone':
        return textForm();
      default:
        return null;
    }
  }, [currentElement.current]);

  return (
    <form onSubmit={preventDefault} onBlur={handleBlur} className={styles.form}>
      {form}
    </form>
  );
};

export default SettingsForm;
