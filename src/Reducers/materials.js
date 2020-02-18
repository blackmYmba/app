import { createAction, handleActions } from 'redux-actions';

const INITIAL_STATE = {
  materials: null,
  materialsLoaded: false
};

export const initMaterials = createAction('Materials/INIT_MATERIALS');

export const setMaterials = createAction('Materials/SET_MATERIALS', materials => ({
  materials
}));

const reducer = handleActions(
  {
    [setMaterials]: (state, action) => {
      state.materials = action.payload.materials.data;
      state.materialsLoaded = true;
      return state;
    },
    [initMaterials]: state => state
  },
  INITIAL_STATE
);

export default reducer;
