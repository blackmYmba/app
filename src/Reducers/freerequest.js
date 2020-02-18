import { createAction, handleActions } from 'redux-actions';

const INITIAL_STATE = {};

export const createFreeRequest = createAction('FREE_REQUEST/POST_FREE_REQUEST', freeRequest => (freeRequest));

export default handleActions(
  {},
  INITIAL_STATE
);
