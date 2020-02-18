import {
  put, call, fork, all, takeLatest
} from 'redux-saga/effects';
import { createStatement } from '../Reducers/statement';
import { setRequestConfirmView } from '../Reducers/selectedSpot';
import { unselectSpot } from '../Reducers/spots';
import userPosition from '../Geolocation/userPosition';
import { postStatement } from '../Api/statement';

function* createStatementSaga(action) {
  const coords = yield call(userPosition);
  try {
    yield call(postStatement, Object.assign(action.payload, coords));
  } catch (err) {
    console.error(err);
  }
  yield put(unselectSpot());
  yield put(setRequestConfirmView(true, 'STATEMENT'));
}

function* watchCreateStatementSaga() {
  yield takeLatest(createStatement, createStatementSaga);
}

export default function* root() {
  yield all([fork(watchCreateStatementSaga)]);
}
