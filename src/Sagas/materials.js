import {
  put, call, all, fork, takeLatest
} from 'redux-saga/effects';
import { fetchAllMaterials } from '../Api/materials';
import { initMaterials, setMaterials } from '../Reducers/materials';

function* loadMaterialsSaga() {
  try {
    const materials = yield call(fetchAllMaterials);
    yield put(setMaterials(materials));
  } catch (e) {
    console.error(e);
  }
}

function* watchMaterialsSaga() {
  yield takeLatest(initMaterials, loadMaterialsSaga);
}

export default function* root() {
  yield all([fork(watchMaterialsSaga)]);
}
