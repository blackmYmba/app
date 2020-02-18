import { createAction, handleActions } from 'redux-actions';

const INITIAL_STATE = {
  organizations: null,
  organizationsLoaded: false,
  organizationsWithFilter: []
};

export const initOrganizations = createAction('Organizations/INIT_ORGANIZATIONS');

export const setOrganizations = createAction('Organizations/SET_ORGANIZATIONS', organizations => ({
  organizations
}));

const reducer = handleActions(
  {
    [setOrganizations]: (state, action) => {
      const { data } = action.payload.organizations;
      const organizationsWithFilter = [];
      if (data.length) {
        data.map((item) => {
          return item.isFilterMobile ? organizationsWithFilter.push(item) : null;
        });
      }
      state.organizationsWithFilter = organizationsWithFilter;
      state.organizations = data;
      state.organizationsLoaded = true;
      return state;
    },
    [initOrganizations]: (state) => state
  },
  INITIAL_STATE
);

export default reducer;
