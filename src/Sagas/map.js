import {
  takeLatest, put, call, all, fork
} from 'redux-saga/effects';
import userPosition from '../Geolocation/userPosition';
import { initMap, setCenter } from '../Reducers/map';

function* loadCoordsSaga() {
  const coords = yield call(userPosition);
  yield put(setCenter(coords.latitude, coords.longitude));
}

function* watchInitMapSaga() {
  yield takeLatest(initMap, loadCoordsSaga);
}

export default function* root() {
  yield all([fork(watchInitMapSaga)]);
}
