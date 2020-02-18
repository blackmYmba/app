import { createAction, handleActions } from 'redux-actions';

const INITIAL_STATE = {};

export const createStatement = createAction('Statement/POST_STATEMENT', statement => (statement));

export default handleActions(
  {},
  INITIAL_STATE
);
