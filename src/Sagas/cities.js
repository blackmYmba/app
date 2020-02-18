import {
  put, call, all, fork, takeLatest
} from 'redux-saga/effects';
import { fetchAllCities } from '../Api/cities';
import { initCities, setCities } from '../Reducers/cities';

function* loadCitiesSaga() {
  try {
    const cities = yield call(fetchAllCities);
    yield put(setCities(cities));
  } catch (e) {
    console.error(e);
  }
}

function* watchCitiesSaga() {
  yield takeLatest(initCities, loadCitiesSaga);
}

export default function* root() {
  yield all([fork(watchCitiesSaga)]);
}
