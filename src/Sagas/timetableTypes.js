import {
  put, call, all, fork, takeLatest
} from 'redux-saga/effects';
import { fetchAllTimetableTypes } from '../Api/timetabletypes';
import { initTimeTableTypes, setTimeTableTypes } from '../Reducers/timetableTypes';

function* loadTimeTableTypesSaga() {
  try {
    const timetableTypes = yield call(fetchAllTimetableTypes);
    yield put(setTimeTableTypes(timetableTypes));
  } catch (e) {
    console.error(e);
  }
}

function* watchTimeTableTypesSaga() {
  yield takeLatest(initTimeTableTypes, loadTimeTableTypesSaga);
}

export default function* root() {
  yield all([fork(watchTimeTableTypesSaga)]);
}
