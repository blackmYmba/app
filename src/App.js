import React from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import { Provider } from 'react-redux';
import configureStore, { AppWithNavigationState } from './store';
import { setConnectionInfo } from './Reducers/deviceInfo';
import { setMyCity } from './Reducers/cities';
import { setMapType } from './Reducers/map';
import { setShowWasteRequest } from './Reducers/firebase';

const store = configureStore();

if (process.env.__DEV__) {
  firebase.config().enableDeveloperMode();
}

firebase.config().setDefaults({
  showTrashRemovals: false,
});

const bootstrap = async () => {
  firebase.analytics().setAnalyticsCollectionEnabled(true);
  firebase.analytics().logEvent("super");
  await firebase.config().fetch(0);
  const activated = await firebase.config().activateFetched();
  const showTrashRemovals = await firebase.config().getValue('showTrashRemovals');
  store.dispatch(setShowWasteRequest(showTrashRemovals.val()));
};

bootstrap();

NetInfo.isConnected.addEventListener('connectionChange', (connectionInfo) => {
  store.dispatch(setConnectionInfo(connectionInfo));
});

const getMyCity = async () => {
  try {
    const cityId = await AsyncStorage.getItem('cityId');
    const cityName = await AsyncStorage.getItem('cityName');
    if (cityId && cityName) {
      store.dispatch(setMyCity(Number(cityId), cityName));
    } else {
      store.dispatch(setMyCity(1, 'Красноярск'));
    }
  } catch (e) {
    console.error(e);
  }
};

const getMapType = async () => {
  try {
    const mapType = await AsyncStorage.getItem('mapType');
    if (mapType) {
      store.dispatch(setMapType(mapType === 'true'));
    } else {
      store.dispatch(setMapType(Platform.OS === 'ios'));
    }
  } catch (e) {
    console.error(e);
  }
};

getMyCity();
getMapType();

export default () => {
  return (
    <Provider store={store}>
      <AppWithNavigationState />
    </Provider>
  );
};
