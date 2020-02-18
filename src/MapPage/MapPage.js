import React from 'react';
import {
  Alert,
  Dimensions,
  View,
  StyleSheet,
  BackHandler
} from 'react-native';
import { withNavigation, NavigationActions } from 'react-navigation';
import {
  compose, pure, setStatic, withState, withHandlers, lifecycle
} from 'recompose';
import Permissions from 'react-native-permissions';
import { connect } from 'react-redux';
import { path } from 'ramda';
import firebase from 'react-native-firebase';
import CPMap from '../CPMap/CPMap';
import MapPanel from './components/MapPanel';
import DetailsPage from '../DetailsPage/DetailsPage';
import CityButton from './components/CityButton';
import LogoButton from './components/LogoButton';
import FiltersButton from './components/FiltersButton';
import { setRegion, setPanelPosition } from '../Reducers/map';
import { initOrganizations } from '../Reducers/organizations';
import { initMaterials } from '../Reducers/materials';
import { initIcons } from '../Reducers/icons';
import {
  initSpots,
  initSpotsList,
  initSpotsListWithGeo,
  unsetCount,
  unsetMaterialFilters,
  unsetMaterialFiltersFinal,
  unsetOrganizationFilters,
  unsetOrganizationFiltersFinal
} from '../Reducers/spots';
import { initCities } from '../Reducers/cities';
import { initTimeTableTypes } from '../Reducers/timetableTypes';
import SearchButton from '../CPMap/components/SearchButton';
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

const globalWidth = Dimensions.get('window').width;

export const getCurrentRoute = (state) => {
  const findCurrentRoute = (navState) => {
    if (navState.index !== undefined) {
      return findCurrentRoute(navState.routes[navState.index]);
    }
    return navState.routeName;
  };
  return findCurrentRoute(state);
};

const MapPage = ({
  detailsHeight, onDetailsReady, onLayout, viewArea, panelPosition, connectionInfo
}) => (
  <View style={styles.container} onLayout={onLayout}>
    <View style={styles.container}>
      <CPMap />
      <SearchButton connectionInfo={connectionInfo} />
      <MapPanel
        contentHeight={detailsHeight}
        viewArea={viewArea}
        position={panelPosition}
      >
        <DetailsPage onReady={onDetailsReady} />
      </MapPanel>
    </View>
  </View>
);

const mapStateToProps = state => ({
  connectionInfo: path(['deviceInfoReducer', 'connectionInfo'], state),
  initialSpots: path(['spotsReducer', 'initialSpots'], state),
  spotsList: path(['spotsReducer', 'spotsList'], state),
  cityId: path(['citiesReducer', 'cityId'], state),
  organizations: path(['organizationsReducer', 'organizations'], state),
  cities: path(['citiesReducer', 'cities'], state),
  materials: path(['materialsReducer', 'materials'], state),
  timetableTypes: path(['timetableTypesReducer', 'timetableTypes'], state),
  panelPosition: path(['map', 'panelPosition'], state),
  nav: state.nav
});

const mapDispatchToProps = {
  back: NavigationActions.back,
  setPanelPosition,
  initOrganizations,
  initMaterials,
  initSpotsListWithGeo,
  setRegion,
  initSpots,
  initSpotsList,
  initCities,
  initTimeTableTypes,
  unsetCount,
  unsetMaterialFilters,
  unsetMaterialFiltersFinal,
  unsetOrganizationFilters,
  unsetOrganizationFiltersFinal,
  initIcons
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withNavigation,
  setStatic(
    'navigationOptions',
    {
      headerBackTitle: 'Назад',
      headerTitle: <CityButton />,
      headerLeft: <LogoButton />,
      headerRight: <FiltersButton />,
    }
  ),
  withState('detailsHeight', 'setDetailsHeight', 0),
  withState('viewArea', 'setViewArea', 0),
  withState('width', 'setWidth', globalWidth - 1),
  withHandlers(() => ({
    onDetailsReady: ({ setDetailsHeight }) => (value) => {
      setDetailsHeight(value);
    },
    onLayout: ({ setViewArea }) => ({ nativeEvent: { layout: { height } } }) => {
      setViewArea(height);
    },
    backPress: ({ setPanelPosition, nav, back }) => () => {
      const routeName = getCurrentRoute(nav);
      if (routeName === 'Map') {
        setPanelPosition('bottom');
      }
      back();
      return true;
    }
  })),
  lifecycle({
    componentDidMount() {
      this.props.initSpots();
      this.props.initOrganizations();
      this.props.initMaterials();
      this.props.initCities();
      this.props.initTimeTableTypes();
      this.props.initIcons();
      firebase.analytics().setCurrentScreen('Map');
      Permissions.request('location').then((response) => {
        this.props.setWidth(globalWidth);
        if (!this.props.connectionInfo) {
          Alert.alert('Предупреждение', 'Требуется интернет-соединение');
        }
        if (response === 'authorized') {
          navigator.geolocation.getCurrentPosition(
            () => {
              this.props.initSpotsListWithGeo();
            },
            () => Alert.alert(
              'Предупреждение',
              'Для корректной работы приложения необходимо предоставить доступ к данным о местоположении устройства'
            ),
            { timeout: 2000 }
          );
        } else {
          this.props.initSpotsList();
          Alert.alert('Предупреждение', 'Для корректной работы приложения требуется доступ к геопозиции');
        }
      });

      BackHandler.addEventListener('hardwareBackPress', this.props.backPress);
    },
    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.props.backPress);
    },
    componentWillReceiveProps(nextProps) {
      if (nextProps.cityId && this.props.cityId !== nextProps.cityId) {
        this.props.initSpots();
        this.props.initOrganizations();
        this.props.unsetMaterialFilters();
        this.props.unsetOrganizationFilters();
        this.props.unsetMaterialFiltersFinal();
        this.props.unsetOrganizationFiltersFinal();
        this.props.unsetCount();
        Permissions.request('location').then((response) => {
          if (response === 'authorized') {
            navigator.geolocation.getCurrentPosition(
              () => {
                this.props.initSpotsListWithGeo();
              },
              () => {
                this.props.initSpotsList();
                Alert.alert(
                  'Предупреждение',
                  'Для корректной работы приложения необходимо предоставить доступ к данным о местоположении устройства'
                );
              },
              { timeout: 2000 }
            );
          }
          if (response === 'denied') {
            this.props.initSpotsList();
            Alert.alert('Предупреждение', 'Для корректной работы приложения требуется доступ к геопозиции');
          }
        });
      }
      if (!this.props.connectionInfo && nextProps.connectionInfo) {
        if (!this.props.spotsList) {
          this.props.initSpotsList();
        }
        if (!this.props.initialSpots) {
          this.props.initSpots();
        }
        if (!this.props.cities) {
          this.props.initCities();
        }
        if (!this.props.organizations) {
          this.props.initOrganizations();
        }
        if (!this.props.materials) {
          this.props.initMaterials();
        }
        if (!this.props.timetableTypes) {
          this.props.initTimeTableTypes();
        }
      }
    }
  }),
  pure,
)(MapPage);
