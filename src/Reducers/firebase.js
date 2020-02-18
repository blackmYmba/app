import { createAction, handleActions } from 'redux-actions';

export const setShowWasteRequest = createAction('CONFIG/SET_SHOW_WASTE_REQUEST', showWasteRequest => ({ showWasteRequest }));

const INITIAL_STATE = {
  showWasteRequest: false
};

export default handleActions(
  {
    [setShowWasteRequest]: (state, action) => {
      state.showWasteRequest = action.payload.showWasteRequest;
      return state;
    },
  },
  INITIAL_STATE
);
