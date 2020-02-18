import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import createLogger from 'redux-logger';
import { combineReducers } from 'redux-immer';
import produce from 'immer';
import { connect } from 'react-redux';
import {
  createReduxContainer,
  createReactNavigationReduxMiddleware,
  createNavigationReducer,
} from 'react-navigation-redux-helpers';

import deviceInfoReducer from './Reducers/deviceInfo';
import mapReducer from './Reducers/map';
import spotsReducer from './Reducers/spots';
import selectedSpotReducer from './Reducers/selectedSpot';
import organizationsReducer from './Reducers/organizations';
import materialsReducer from './Reducers/materials';
import StatementReducer from './Reducers/statement';
import timetableTypesReducer from './Reducers/timetableTypes';
import citiesReducer from './Reducers/cities';
import FreeRequestReducer from './Reducers/freerequest';
import wasteRequestReducer from './Reducers/wasterequest';
import iconsReducer from './Reducers/icons';
import firebaseReducer from './Reducers/firebase';

import Route from './Route';
import rootSaga from './rootSaga';

const navReducer = createNavigationReducer(Route);

const navMiddleware = createReactNavigationReduxMiddleware(state => state.nav);

const App = createReduxContainer(Route);
const mapStateToProps = state => ({
  state: state.nav,
});
export const AppWithNavigationState = connect(mapStateToProps)(App);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers(produce, {
  deviceInfoReducer,
  spotsReducer,
  selectedSpotReducer,
  materialsReducer,
  map: mapReducer,
  organizationsReducer,
  timetableTypesReducer,
  citiesReducer,
  StatementReducer,
  FreeRequestReducer,
  wasteRequestReducer,
  iconsReducer,
  firebaseReducer,
  nav: navReducer
});

const createDevLogger = __DEV__ ? createLogger : undefined;

const configureStore = (initialState) => {
  const sagaMiddleware = createSagaMiddleware();
  const allMiddleware = [sagaMiddleware, navMiddleware, createDevLogger].filter(m => m);
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...allMiddleware))
  );
  sagaMiddleware.run(rootSaga);
  store.close = () => store.dispatch(END);
  return store;
};

export default configureStore;
