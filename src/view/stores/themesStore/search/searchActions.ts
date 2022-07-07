import { SearchUpdate } from '../../../../models/themes.models';
import ActionTypes from '../actionTypes';

export function updateSearch(search: SearchUpdate) {
  return {
    type: ActionTypes.UPDATE_SEARCH,
    payload: search,
  } as const;
}

export function updateSearchResults(results: number) {
  return {
    type: ActionTypes.UPDATE_SEARCH_RESULTS,
    payload: results,
  } as const;
}
