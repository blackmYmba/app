import {
  put, call, all, fork, takeLatest, select
} from 'redux-saga/effects';
import { fetchAllOrganizations } from '../Api/organizations';
import { initOrganizations, setOrganizations } from '../Reducers/organizations';
import { path } from 'ramda';

function* loadOrganizationsSaga() {
  try {
    const getCityId = state => path(['citiesReducer', 'cityId'], state);
    const cityId = yield select(getCityId);
    const organizations = yield call(fetchAllOrganizations, cityId);
    yield put(setOrganizations(organizations));
  } catch (e) {
    console.error(e);
  }
}

function* watchOrganizationsSaga() {
  yield takeLatest(initOrganizations, loadOrganizationsSaga);
}

export default function* root() {
  yield all([fork(watchOrganizationsSaga)]);
}
