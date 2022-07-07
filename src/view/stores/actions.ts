import ActionTypes from './actionTypes';

export default function resetState() {
  return {
    type: ActionTypes.RESET_STATE,
  } as const;
}
