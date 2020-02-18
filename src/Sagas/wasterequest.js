import {
  call, fork, all, takeLatest
} from 'redux-saga/effects';
import { createWasteRequest } from '../Reducers/wasterequest';
import { postWasteRequest } from '../Api/wasterequest';

function* createWasteRequestSaga(action) {
  try {
    yield call(postWasteRequest, Object.assign(action.payload));
  } catch (err) {
    console.error(err);
  }
}

function* watchCreateWasteRequestSaga() {
  yield takeLatest(createWasteRequest, createWasteRequestSaga);
}

export default function* root() {
  yield all([fork(watchCreateWasteRequestSaga)]);
}
