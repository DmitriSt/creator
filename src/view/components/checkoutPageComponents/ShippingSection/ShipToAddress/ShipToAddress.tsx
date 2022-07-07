import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { IShippingAddress } from '../../../../../models/checkout.models';
import { IExtendedFilterConfigItem } from '../../../../../models/commonPage.models';
import getCountriesInfo from '../../../../stores/checkoutStore/checkout/checkoutSelectors';
import TextField from '../../../cartPageComponents/TextField/TextField';
import SearchDropdown from '../ShippingAddress/SearchDropdown/SearchDropdown';
import EmailField from './EmailField/EmailField';
import styles from './shipToAddress.module.scss';

type ShipToAddressPropsType = {
  callback: (dto: IShippingAddress) => void;
  config: IShippingAddress | null;
};

const initialShipAddressInfo: IShippingAddress = {
  firstName: '',
  lastName: '',
  countryCode: '',
  phone1: '',
  address1: '',
  address2: '',
  city: '',
  stateCode: '',
  postalCode: '',
  email: '',
};

const ShipToAddress = ({ callback, config = initialShipAddressInfo }: ShipToAddressPropsType) => {
  const { states, countries } = useSelector(getCountriesInfo);

  const countryStates = useMemo(() => {
    const country = countries.find((item) => item.value === config.countryCode);
    return country ? states[country.value] : [];
  }, [config.countryCode]);

  const updateFirstName = (value: string) => {
    callback({ ...config, firstName: value });
  };
  const updateLastName = (value: string) => {
    callback({ ...config, lastName: value });
  };
  const updatePhoneNumber = (value: string) => {
    callback({ ...config, phone1: value });
  };
  const updateCountry = (value: IExtendedFilterConfigItem | null) => {
    callback({
      ...config,
      countryCode: value ? value.value : '',
      stateCode: '',
    });
  };
  const updateStreetAddress = (value: string) => {
    callback({ ...config, address1: value });
  };
  const updateStreetAddressSecond = (value: string) => {
    callback({ ...config, address2: value });
  };
  const updateCity = (value: string) => {
    callback({ ...config, city: value });
  };
  const updateState = (value: IExtendedFilterConfigItem | null) => {
    callback({ ...config, stateCode: value ? value.value : '' });
  };
  const updatePostalCode = (value: string) => {
    callback({ ...config, postalCode: value });
  };
  const updateEmail = (value: string) => {
    callback({ ...config, email: value });
  };
  return (
    <div className={styles.wrapper}>
      <TextField initialValue={config.firstName} id='firstName' onInput={updateFirstName} placeholder='First Name' />
      <TextField initialValue={config.lastName} id='lastName' onInput={updateLastName} placeholder='Last Name' />
      <SearchDropdown
        initialValue={config.countryCode}
        searchList={countries}
        callback={updateCountry}
        placeholder='Country'
      />
      <TextField id='phone' initialValue={config.phone1} onInput={updatePhoneNumber} placeholder='Phone Number' />
      <TextField
        initialValue={config.address1}
        id='streetAddress'
        onInput={updateStreetAddress}
        placeholder='Street Address'
      />
      <TextField
        initialValue={config.address2}
        id='streetAddressSecond'
        onInput={updateStreetAddressSecond}
        placeholder='Street Address 2 (Optional)'
      />
      <TextField initialValue={config.city} id='city' onInput={updateCity} placeholder='City' />
      <SearchDropdown
        initialValue={config.stateCode}
        dependency={config.countryCode}
        searchList={countryStates}
        callback={updateState}
        placeholder='State/Province/Region'
      />
      <TextField
        initialValue={config.postalCode}
        id='postalCode'
        onInput={updatePostalCode}
        placeholder='Postal Code'
      />
      <EmailField initialValue={config.email} callback={updateEmail} />
    </div>
  );
};

const memoizedShipToAddress = React.memo(ShipToAddress);

export default memoizedShipToAddress;
