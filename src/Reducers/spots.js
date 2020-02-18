import { createAction, handleActions } from 'redux-actions';
import {
  keys,
  pickBy,
  map,
  any,
  filter,
  flatten
} from 'ramda';
import { createSelector } from 'reselect';

const INITIAL_STATE = {
  initialSpots: null,
  spots: null,
  selectedSpotId: null,
  spotsLoaded: false,
  organizationFilters: {},
  materialFilters: {},
  organizationFiltersFinal: {},
  materialFiltersFinal: {},
  spotsListSearchText: '',
  spotsListIsFetching: false
};

const getChosenMaterials = (materialGroups, materialGroupIds) => {
  if (!materialGroups || !materialGroups.length) { return []; }
  return flatten(map(i => i.materials, filter(i => materialGroupIds.some(m => i.id === m), materialGroups)));
};
const getChosenSpotsByArray = (spots, filterField, chosenIds) => {
  return filter(s => s[filterField].some(m => any(i => i === m)(chosenIds)), spots);
};
const getChosenSpotsById = (spots, filterField, chosenIds) => {
  return filter(s => any(i => i === s[filterField])(chosenIds), spots);
};

export const setOrganizationFilters = createAction(
  'Spots/SET_ORGANIZATION_FILTERS',
  organizationId => ({ organizationId })
);
export const setOrganizationFiltersFinal = createAction(
  'Spots/SET_ORGANIZATION_FILTERS_FINAL',
  organizationIds => ({ organizationIds })
);
export const setOrganizationFiltersOld = createAction(
  'Spots/SET_ORGANIZATION_FILTERS_OLD',
  organizationIdsOld => ({ organizationIdsOld })
);
export const setMaterialFilters = createAction(
  'Spots/SET_MATERIAL_FILTERS',
  materialId => ({ materialId })
);
export const setMaterialFiltersFinal = createAction(
  'Spots/SET_MATERIAL_FILTERS_FINAL',
  materialIds => ({ materialIds })
);
export const setMaterialFiltersOld = createAction(
  'Spots/SET_MATERIAL_FILTERS_OLD',
  materialIdsOld => ({ materialIdsOld })
);

export const unsetOrganizationFilters = createAction('Spots/UNSELECT_ORGANIZATION_FILTERS');
export const unsetMaterialFilters = createAction('Spots/UNSELECT_MATERIAL_FILTERS');

export const unsetOrganizationFiltersFinal = createAction('Spots/UNSELECT_ORGANIZATION_FILTERS_FINAL');
export const unsetMaterialFiltersFinal = createAction('Spots/UNSELECT_MATERIAL_FILTERS_FINAL');

export const unsetFlag = createAction('Spots/UNSET_FLAG');
export const initSpots = createAction('Spots/INIT_SPOTS');
export const setInitialSpots = createAction('Spots/SET_INITIAL_SPOTS', initialSpots => ({ initialSpots }));

export const initSpotsList = createAction('Spots/INIT_SPOTS_LIST');
export const initSpotsListWithGeo = createAction('Spots/INIT_SPOTS_LIST_WITH_GEO');
export const setSpotsList = createAction('Spots/SET_SPOTS_LIST', spotsList => ({ spotsList }));

export const setFilterSpotsList = createAction('Spots/SET_FILTER_SPOTS_LIST', filterSpotsList => ({ filterSpotsList }));
export const setSpotsListIsFetching = createAction(
  'Spots/SET_SPOTS_LIST_IS_FETCHING',
  spotsListIsFetching => ({ spotsListIsFetching })
);
export const setSpotsListSearchText = createAction(
  'Spots/SET_SPOTS_LIST_SEARCH_TEXT',
  spotsListSearchText => ({ spotsListSearchText })
);

export const filterSpots = createAction('Spots/FILTER_SPOTS', (materials, filterFlag) => ({ materials, filterFlag }));

export const filterSpotsCount = createAction('Spots/FILTER_SPOTS_COUNT', count => ({ count }));
export const unsetCount = createAction('Spots/UNSET_COUNT');
export const selectSpot = createAction(
  'Spots/SELECT_SPOT',
  (selectedSpotId, deviceId) => ({
    selectedSpotId, deviceId
  })
);
export const unselectSpot = createAction('Spots/UNSELECT_SPOT');
export const createRequest = createAction('Spots/POST_REQUEST', request => request);
export const createTrouble = createAction('Spots/POST_TROUBLE', trouble => trouble);

export const spotsSelector = payload => payload.initialSpots;
export const spotsSelectorGlobal = payload => payload.spotsReducer.spots;

export const filteredSpots = createSelector(
  spotsSelector,
  spots => (spots ? spots.filter(spot => spot.location) : INITIAL_STATE.initialSpots)
);

export default handleActions(
  {
    [initSpots]: (state) => {
      state.initialSpotsLoaded = false;
      return state;
    },
    [initSpotsList]: (state) => {
      state.spotsListLoaded = false;
      return state;
    },
    [initSpotsListWithGeo]: (state) => {
      state.spotsListLoaded = false;
      return state;
    },
    [setSpotsList]: (state, action) => {
      state.spotsList = action.payload.spotsList;
      state.filterSpotsList = action.payload.spotsList;
      state.spotsListLoaded = true;
      return state;
    },
    [setSpotsListIsFetching]: (state, action) => {
      state.spotsListIsFetching = action.payload.spotsListIsFetching;
      return state;
    },
    [setSpotsListSearchText]: (state, action) => {
      state.spotsListSearchText = action.payload.spotsListSearchText;
      return state;
    },
    [setFilterSpotsList]: (state, action) => {
      state.filterSpotsList = action.payload.filterSpotsList;
      return state;
    },
    [selectSpot]: (state, action) => {
      state.selectedSpotId = action.payload.selectedSpotId;
      return state;
    },
    [unselectSpot]: (state) => {
      state.selectedSpotId = null;
      return state;
    },
    [setInitialSpots]: (state, action) => {
      state.initialSpots = action.payload.initialSpots;
      state.spots = filteredSpots({ initialSpots: action.payload.initialSpots });
      state.initialSpotsLoaded = true;
      return state;
    },
    [unsetFlag]: (state) => {
      state.filterFlag = false;
      return state;
    },
    [filterSpots]: (state, action) => {
      const organizationIds = map(Number, keys(pickBy(Boolean, state.organizationFiltersFinal)));
      const materialGroupIds = map(Number, keys(pickBy(Boolean, state.materialFiltersFinal)));
      const { initialSpots } = state;
      const { materials, filterFlag } = action.payload;
      let result = initialSpots;
      if (organizationIds.length) {
        result = getChosenSpotsById(result, 'organizationId', organizationIds);
      }
      materialGroupIds.forEach((item) => {
        const chosenMaterials = getChosenMaterials(materials, [item]);
        result = getChosenSpotsByArray(result, 'materials', chosenMaterials);
      });
      state.spots = filteredSpots({ initialSpots: result });
      state.filterFlag = filterFlag;
      return state;
    },
    [filterSpotsCount]: (state, action) => {
      const organizationIds = map(Number, keys(pickBy(Boolean, state.organizationFilters)));
      const materialGroupIds = map(Number, keys(pickBy(Boolean, state.materialFilters)));
      const { initialSpots } = state;
      const { count } = action.payload;
      let result = initialSpots;
      if (organizationIds.length) {
        result = getChosenSpotsById(result, 'organizationId', organizationIds);
      }
      materialGroupIds.forEach((item) => {
        const chosenMaterials = getChosenMaterials(count, [item]);
        result = getChosenSpotsByArray(result, 'materials', chosenMaterials);
      });
      state.spotsCount = result.length;
      return state;
    },
    [unsetCount]: (state) => {
      state.spotsCount = null;
      return state;
    },
    [setOrganizationFilters]: (state, action) => {
      const old = state.organizationFilters[action.payload.organizationId];
      state.organizationFilters[action.payload.organizationId] = !old;
      return state;
    },
    [setOrganizationFiltersFinal]: (state, action) => {
      state.organizationFiltersFinal = action.payload.organizationIds;
      return state;
    },
    [unsetOrganizationFiltersFinal]: (state) => {
      state.organizationFiltersFinal = {};
      return state;
    },
    [setOrganizationFiltersOld]: (state, action) => {
      state.organizationFilters = action.payload.organizationIdsOld;
      return state;
    },
    [unsetOrganizationFilters]: (state) => {
      state.organizationFilters = {};
      return state;
    },
    [setMaterialFilters]: (state, action) => {
      const old = state.materialFilters[action.payload.materialId];
      state.materialFilters[action.payload.materialId] = !old;
      return state;
    },
    [setMaterialFiltersFinal]: (state, action) => {
      state.materialFiltersFinal = action.payload.materialIds;
      return state;
    },
    [unsetMaterialFiltersFinal]: (state) => {
      state.materialFiltersFinal = {};
      return state;
    },
    [setMaterialFiltersOld]: (state, action) => {
      state.materialFilters = action.payload.materialIdsOld;
      return state;
    },
    [unsetMaterialFilters]: (state) => {
      state.materialFilters = {};
      return state;
    },
  },
  INITIAL_STATE
);
