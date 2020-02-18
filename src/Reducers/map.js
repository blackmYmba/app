import { original } from 'immer';
import { createAction, handleActions } from 'redux-actions';

const INITIAL_STATE = {
  region: {
    latitude: 56.011469,
    longitude: 92.864142,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  },
  marker: null,
  panelPosition: 'bottom'
};

export const initMap = createAction('Map/INIT_MAP');
export const setMapType = createAction('Map/SET_MAP_TYPE', mapType => ({ mapType }));
export const setMarker = createAction('Map/SET_MARKER', marker => ({ marker }));
export const setCenter = createAction('Map/SET_CENTER', (latitude, longitude) => ({
  latitude,
  longitude
}));
export const setRegion = createAction('Map/SET_REGION', region => ({
  region
}));
export const setPanelPosition = createAction('Map/SET_PANEL_POSITION', position => ({ position }));

export const regionSelector = state => state.map.region;

export default handleActions(
  {
    [setPanelPosition]: (state, action) => {
      state.panelPosition = action.payload.position;
      return state;
    },
    [setCenter]: (state, { payload: { latitude, longitude } }) => {
      state.region = {
        ...original(state.region),
        latitude,
        longitude
      };
      return state;
    },
    [setMapType]: (state, action) => {
      state.mapType = action.payload.mapType;
      return state;
    },
    [setMarker]: (state, action) => {
      state.marker = action.payload.marker;
      return state;
    },
    [setRegion]: (state, action) => {
      state.region = action.payload.region;
      return state;
    },
    [initMap]: (state) => state
  },
  INITIAL_STATE
);
