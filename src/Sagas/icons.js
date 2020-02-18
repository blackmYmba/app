import {
  put, call, all, fork, takeLatest
} from 'redux-saga/effects';
import { fetchIcons } from '../Api/icons';
import { initIcons, setIcons } from '../Reducers/icons';

function* loadIconsSaga() {
  try {
    const cities = yield call(fetchIcons);
    yield put(setIcons(cities));
  } catch (e) {
    console.error(e);
  }
}

function* watchIconsSaga() {
  yield takeLatest(initIcons, loadIconsSaga);
}

export default function* root() {
  yield all([fork(watchIconsSaga)]);
}
