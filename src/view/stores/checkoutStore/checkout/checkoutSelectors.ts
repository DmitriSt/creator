import { ICountryItem, MappedCountries } from '../../../../models/checkout.models';
import { RootStateType } from '../../store';

function convertToDropdownStructure(item: ICountryItem) {
  return {
    text: item.name,
    value: item.code,
  };
}

const getCountriesInfo = (state: RootStateType) => {
  const countries = state.checkoutState.checkout.countries;
  const mappedCountries: MappedCountries = {
    states: {},
    countries: [],
  };
  return countries.reduce((total, item) => {
    total.countries.push(convertToDropdownStructure(item));
    total.states[item.code] = item.states.map(convertToDropdownStructure);
    return total;
  }, mappedCountries);
};

export default getCountriesInfo;
