import { all, fork, setContext } from 'redux-saga/effects';
import spotsSagas from './Sagas/spots';
import mapSagas from './Sagas/map';
import organizationSagas from './Sagas/organizations';
import statementSagas from './Sagas/statement';
import materialsSagas from './Sagas/materials';
import timetableTypesSagas from './Sagas/timetableTypes';
import citiesSagas from './Sagas/cities';
import freeRequestsSagas from './Sagas/freerequest';
import wasteRequestsSagas from './Sagas/wasterequest';
import iconsSagas from './Sagas/icons';

export default function* rootSaga() {
  yield setContext({ config: {} });
  yield all([
    fork(spotsSagas),
    fork(mapSagas),
    fork(organizationSagas),
    fork(statementSagas),
    fork(materialsSagas),
    fork(timetableTypesSagas),
    fork(freeRequestsSagas),
    fork(citiesSagas),
    fork(wasteRequestsSagas),
    fork(iconsSagas)
  ]);
}
