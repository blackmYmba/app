import {
  call, fork, all, takeLatest
} from 'redux-saga/effects';
import { createFreeRequest } from '../Reducers/freerequest';
import { postFreeRequest } from '../Api/freerequest';

function* createFreeRequestSaga(action) {
  try {
    yield call(postFreeRequest, Object.assign(action.payload));
  } catch (err) {
    console.error(err);
  }
}

function* watchCreateFreeRequestSaga() {
  yield takeLatest(createFreeRequest, createFreeRequestSaga);
}

export default function* root() {
  yield all([fork(watchCreateFreeRequestSaga)]);
}
