import { createAction, handleActions } from 'redux-actions';

const INITIAL_STATE = {
  timetableTypes: null,
  timetableTypesLoaded: false
};

export const initTimeTableTypes = createAction('Timetabletypes/INIT_TIME_TABLE_TYPES');

export const setTimeTableTypes = createAction('Timetabletypes/SET_TIME_TABLE_TYPES', timetableTypes => ({
  timetableTypes
}));

const reducer = handleActions(
  {
    [setTimeTableTypes]: (state, action) => {
      state.timetableTypes = action.payload.timetableTypes.data;
      state.timetableTypesLoaded = true;
      return state;
    },
    [initTimeTableTypes]: state => state
  },
  INITIAL_STATE
);

export default reducer;
