import {
  put, call, fork, all, takeLatest, select
} from 'redux-saga/effects';
import { Alert } from 'react-native';
import { path } from 'ramda';
import {
  setInitialSpots,
  initSpots,
  selectSpot,
  createRequest,
  createTrouble,
  initSpotsList,
  setSpotsList,
  initSpotsListWithGeo,
  setSpotsListIsFetching
} from '../Reducers/spots';
import {
  setSelectedSpot,
  setRequestOverfillView,
  setRequestConfirmView,
  setTroubleView,
  setDetailedView,
  setTroubleRights,
  setRequestRights
} from '../Reducers/selectedSpot';
import { setCenter, setPanelPosition } from '../Reducers/map';
import userPosition from '../Geolocation/userPosition';
import { fetchAllSpots, fetchSelectedSpot, fetchSpotsList } from '../Api/spots';
import { postRequest } from '../Api/request';
import { postTrouble } from '../Api/trouble';

function* initSpotsSaga() {
  try {
    const getCityId = state => path(['citiesReducer', 'cityId'], state);
    const cityId = yield select(getCityId);
    const response = yield call(fetchAllSpots, cityId);
    yield put(setInitialSpots(response.data));
  } catch (e) {
    console.error(e);
  }
}

function* initSpotsListSaga() {
  let params;
  let myCityId;
  try {
    const getCityId = state => path(['citiesReducer', 'cityId'], state);
    myCityId = yield select(getCityId);
    params = `?cityId=${myCityId}`;
  } catch (e) {
    console.error(e);
  }
  try {
    const response = yield call(fetchSpotsList, params);
    yield put(setSpotsList(response.data));
    yield put(setSpotsListIsFetching(false));
  } catch (e) {
    console.error(e);
  }
}

function* initSpotsListWithGeoSaga() {
  let params;
  let myCityId;
  try {
    const getCityId = state => path(['citiesReducer', 'cityId'], state);
    myCityId = yield select(getCityId);
    const coords = yield call(userPosition);
    params = `?cityId=${myCityId}&latitude=${coords.latitude}&longitude=${coords.longitude}`;
  } catch (e) {
    console.error(e);
  }
  try {
    const response = yield call(fetchSpotsList, params);
    yield put(setSpotsList(response.data));
    yield put(setSpotsListIsFetching(false));
  } catch (e) {
    console.error(e);
  }
}

function* selectSpotSaga(action) {
  try {
    const response = yield call(fetchSelectedSpot, action.payload);
    const [longitude, latitude] = response.data.location.coordinates;
    yield put(setPanelPosition(null)); // костыль для панельки после рефактора
    yield put(setCenter(latitude, longitude));
    yield put(setSelectedSpot(response.data));
  } catch (e) {
    Alert.alert('Предупреждение', 'Требуется интернет-соединение');
  }
}

function* createRequestSaga(action) {
  let params;
  try {
    const coords = yield call(userPosition);
    params = coords;
  } catch (e) {
    Alert.alert('Предупреждение', 'Требуется доступ к геопозиции');
  }
  try {
    yield call(postRequest, Object.assign(action.payload, params));
    yield put(setRequestRights(false));
  } catch (err) {
    console.error(err);
  }
  yield put(setRequestOverfillView(false));
  yield put(setDetailedView(false));
  yield put(setRequestConfirmView(true, 'REQUEST'));
}

function* createTroubleSaga(action) {
  let params;
  try {
    params = yield call(userPosition);
  } catch (e) {
    Alert.alert('Предупреждение', 'Требуется доступ к геопозиции');
  }
  try {
    yield call(postTrouble, Object.assign(action.payload, params));
    yield put(setTroubleRights(false));
  } catch (err) {
    console.error(err);
  }
  yield put(setTroubleView(false));
  yield put(setDetailedView(false));
  yield put(setRequestConfirmView(true, 'TROUBLE'));
}

function* watchInitSpotsSaga() {
  yield takeLatest(initSpots, initSpotsSaga);
}

function* watchInitSpotsListSaga() {
  yield takeLatest(initSpotsList, initSpotsListSaga);
}

function* watchInitSpotsListWithGeoSaga() {
  yield takeLatest(initSpotsListWithGeo, initSpotsListWithGeoSaga);
}

function* watchSelectSpotSaga() {
  yield takeLatest(selectSpot, selectSpotSaga);
}

function* watchCreateRequestSaga() {
  yield takeLatest(createRequest, createRequestSaga);
}

function* watchCreateTroubleSaga() {
  yield takeLatest(createTrouble, createTroubleSaga);
}

export default function* root() {
  yield all([
    fork(watchInitSpotsSaga),
    fork(watchInitSpotsListSaga),
    fork(watchSelectSpotSaga),
    fork(watchCreateRequestSaga),
    fork(watchCreateTroubleSaga),
    fork(watchInitSpotsListWithGeoSaga)
  ]);
}
