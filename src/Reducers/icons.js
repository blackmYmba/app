import { createAction, handleActions } from 'redux-actions';

const INITIAL_STATE = {
  icons: null
};

export const initIcons = createAction('Materials/INIT_ICONS');

export const setIcons = createAction('Materials/SET_ICONS', icons => ({
  icons
}));

const reducer = handleActions(
  {
    [setIcons]: (state, action) => {
      state.icons = action.payload.icons.data;
      return state;
    },
    [initIcons]: state => state
  },
  INITIAL_STATE
);

export default reducer;
