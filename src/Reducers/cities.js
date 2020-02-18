import { createAction, handleActions } from 'redux-actions';

const INITIAL_STATE = {
  cities: null,
  citiesLoaded: false
};

export const initCities = createAction('Cities/INIT_CITIES');
export const setMyCity = createAction('Cities/SET_MY_CITY', (cityId, cityName) => ({ cityId, cityName }));
export const setSelectedCity = createAction('Cities/SET_SELECTED_CITY', (selectedCityId, selectedCityName) => ({ selectedCityId, selectedCityName }));
export const setCities = createAction('Cities/SET_CITIES', cities => ({
  cities
}));

const reducer = handleActions(
  {
    [setSelectedCity]: (state, action) => {
      state.selectedCityId = action.payload.selectedCityId;
      state.selectedCityName = action.payload.selectedCityName;
      return state;
    },
    [setCities]: (state, action) => {
      state.cities = action.payload.cities.data;
      state.citiesLoaded = true;
      return state;
    },
    [setMyCity]: (state, action) => {
      state.cityId = action.payload.cityId;
      state.cityName = action.payload.cityName;
      return state;
    },
    [initCities]: (state) => { return state; }
  },
  INITIAL_STATE
);

export default reducer;
