import React from 'react';
import {
  View, StyleSheet, Dimensions, Platform
} from 'react-native';
import ClusteredMapView from 'react-native-maps-super-cluster';
import { connect } from 'react-redux';
import {
  compose, lifecycle, pure, withHandlers, withState
} from 'recompose';
import { map, find, propEq, path } from 'ramda';
import { Marker } from 'react-native-maps';
import { regionSelector, setRegion, setPanelPosition } from '../Reducers/map';
import {
  unselectSpot,
  selectSpot,
  unsetFlag,
} from '../Reducers/spots';
import GetMyPositionButton from './components/GetMyPositionButton';
import ClusterMarker from './components/ClusterMarker';
import CustomMarker from './components/CustomMarker';
import spotsSelector from '../selectors/spotsSelector';
import greenBalloon from '../../content/green-balloon.png';
import activeBalloon from '../../content/active-balloon.png';
import groupMarker from '../../content/group-marker.png';

const globalWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: globalWidth - 1
  },
  map: {
    flex: 1
  },
});

const renderCluster = (cluster, onPress) => {
  const { coordinate, pointCount, clusterId } = cluster;
  return (
    <ClusterMarker
      coordinate={coordinate}
      onPress={onPress}
      image={groupMarker}
      identifier={clusterId}
      key={clusterId}
      pointCount={pointCount}
    />
  );
};

const renderMarker = ({ spot, markerHandler, selectedSpotId }) => {
  return (
    <CustomMarker
      key={`key-${spot.id}`}
      identifier={`identifier-${spot.id}`}
      coordinate={spot.location}
      onPress={e => markerHandler(e, spot)}
      image={selectedSpotId === spot.id ? activeBalloon : greenBalloon}
    />
  );
};

const customMapStyle = [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }];

const CPMapView = ({
  region, unselectSpotHandler, onMapReady, onRegionChange, spots, selectedSpotId, onGetRef, width, markerHandler,
  animateToCoordinate, mapType, marker
}) => {
  return (
    <View style={[styles.container, { width }]}>
      <ClusteredMapView
        ref={onGetRef}
        mapType={mapType ? 'hybrid' : 'standard'}
        animateClusters={false}
        radius={40}
        style={styles.map}
        customMapStyle={customMapStyle}
        onPress={unselectSpotHandler}
        onMapReady={onMapReady}
        onRegionChangeComplete={onRegionChange}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        userLocationAnnotationTitle="Мое местоположение"
        zoomControlEnabled={true}
        showsTraffic={false}
        showsBuildings={true}
        data={spots}
        toolbarEnabled={false}
        renderMarker={spot => renderMarker({ spot, markerHandler, selectedSpotId })}
        renderCluster={renderCluster}
      >
        {marker
          ? <Marker
            coordinate={marker}
            tracksViewChanges={false}
          /> : null
        }
      </ClusteredMapView>
      { Platform.OS === 'ios' ? <GetMyPositionButton animateToCoordinate={animateToCoordinate} /> : null }
    </View>
  );
};

const mapDispatchToProps = {
  unselectSpot,
  setRegion,
  selectSpot,
  unsetFlag,
  setPanelPosition
};

const mapStateToProps = state => ({
  selectedSpotId: path(['spotsReducer', 'selectedSpotId'], state),
  connectionInfo: path(['deviceInfoReducer', 'connectionInfo'], state),
  region: regionSelector(state),
  spots: spotsSelector(state),
  selectedSpot: path(['selectedSpotReducer', 'selectedSpot'], state),
  thisSpots: path(['spotsReducer', 'spots'], state),
  initialSpots: path(['spotsReducer', 'initialSpots'], state),
  filterFlag: path(['spotsReducer', 'filterFlag'], state),
  deviceId: path(['deviceInfoReducer', 'deviceId'], state),
  mapType: path(['map', 'mapType'], state),
  marker: path(['map', 'marker'], state)
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withState('width', 'setWidth', globalWidth - 1),
  withHandlers(() => {
    let _ref;
    return {
      onGetRef: () => (ref) => {
        _ref = ref;
      },
      fitToCoordinates: () => (...args) => {
        if (!_ref) { return; }
        _ref.mapview.fitToCoordinates(...args);
      },
      animateToCoordinate: () => (...args) => {
        if (!_ref) { return; }
        _ref.mapview.animateToCoordinate(...args);
      },
      animateToRegion: () => (...args) => {
        if (!_ref) { return; }
        _ref.mapview.animateToRegion(...args);
      }
    };
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const nextFilterFlag = nextProps.filterFlag;
      if (nextProps.selectedSpotId && this.props.selectedSpotId !== nextProps.selectedSpotId) {
        const selectedSpot = find(propEq('id', nextProps.selectedSpotId))(this.props.initialSpots);
        const marker = {
          latitude: selectedSpot.location.coordinates[1],
          longitude: selectedSpot.location.coordinates[0],
          longitudeDelta: 0.00436,
          latitudeDelta: 0.00328
        };
        this.props.animateToRegion(marker, 500);
        this.props.setPanelPosition('middle');
      }
      if (nextFilterFlag) {
        const nextSpots = nextProps.thisSpots;
        const markers = map(n => ({
          latitude: n.location.coordinates[1],
          longitude: n.location.coordinates[0],
        }), nextSpots);
        this.props.fitToCoordinates(
          markers,
          { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true }
        );
        this.props.unsetFlag();
      }
      if (this.props.initialSpots !== nextProps.initialSpots) {
        const markers = map(n => ({
          latitude: n.location.coordinates[1],
          longitude: n.location.coordinates[0],
        }), nextProps.initialSpots);
        this.props.fitToCoordinates(
          markers,
          { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true }
        );
      }
      if (nextProps.marker && this.props.marker !== nextProps.marker) {
        const zoom = {
          longitudeDelta: 0.00436,
          latitudeDelta: 0.00328
        };
        this.props.animateToRegion({ ...nextProps.marker, ...zoom }, 500);
      }
    }
  }),
  withHandlers({
    onMapReady: p => () => {
      p.setWidth(globalWidth + 1);
    },
    onRegionChange: p => (e) => {
      p.setRegion(e);
    },
    markerHandler: ({ unselectSpot, selectSpot, deviceId, setPanelPosition }) => (e, spot) => {
      e.stopPropagation();
      e.preventDefault();
      unselectSpot();
      selectSpot(spot.id, deviceId);
      setPanelPosition('middle');
    },
    unselectSpotHandler: p => (e) => {
      e.stopPropagation();
      e.preventDefault();
      p.setPanelPosition('bottom');
      if (!p.selectedSpot) {
        return;
      }
      p.unselectSpot();
    }
  }),
  pure
)(CPMapView);
