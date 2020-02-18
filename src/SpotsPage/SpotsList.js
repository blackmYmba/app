import React from 'react';
import {
  FlatList,
  Image,
  View,
  Text,
  Alert,
  StyleSheet
} from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { find, propEq, prop, path } from 'ramda';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Permissions from 'react-native-permissions';
import {
  selectSpot,
  initSpotsList,
  initSpotsListWithGeo,
  unsetOrganizationFilters,
  unsetMaterialFilters,
  filterSpots,
  filterSpotsCount,
  unsetOrganizationFiltersFinal,
  unsetMaterialFiltersFinal,
  unsetCount,
  setSpotsList,
  setFilterSpotsList,
  setSpotsListIsFetching,
  setSpotsListSearchText
} from '../Reducers/spots';
import { images } from '../OrganizationFiltersPage/OrganizationFiltersPage';
import CpLogoIcon from '../../content/cp-logo.png';
import { DARKGRAY } from '../Colors/Colors';

const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 40,
    resizeMode: 'contain'
  },
  distance: {
    fontSize: 12,
    color: DARKGRAY
  },
  logoView: {
    paddingLeft: 20
  },
  container: {
    flex: 1
  },
  renderItemText: {
    fontSize: 16
  },
  subtitle: {
    fontSize: 12,
    color: DARKGRAY
  }
});

class SpotsList extends React.Component {
  static navigationOptions = {
    title: 'Пункты приема',
    headerTitleStyle: {
      fontWeight: 'normal'
    },
    headerLeft: (
      <View style={styles.logoView}>
        <Image
          source={CpLogoIcon}
          style={styles.image}
        />
      </View>
    ),
    headerRight: (
      <View />
    )
  };

  componentDidMount() {
    if (!this.props.spotsList) {
      Alert.alert('Предупреждение', 'Требуется интернет-соединение');
    }
  }

  unsetFilters = () => {
    this.props.unsetMaterialFilters();
    this.props.unsetOrganizationFilters();
    this.props.unsetMaterialFiltersFinal();
    this.props.unsetOrganizationFiltersFinal();
    this.props.filterSpotsCount(this.props.materials);
    this.props.filterSpots(this.props.materials, false);
    this.props.unsetCount();
  };

  convertDistance = (distance) => {
    const convertDistance = distance < 1000 ? `${parseInt(distance, 10)} м` : `${parseInt(distance / 1000, 10)} км`;
    return (
      <Text style={styles.distance}>
        {convertDistance}
      </Text>
    );
  };

  keyExtractor = (item, index) => index.toString();

  searchFilterFunction = (text) => {
    this.props.setSpotsListSearchText(text);
    const newData = this.props.spots.filter((item) => {
      const itemOrgTitle = prop('title', find(propEq('id', item.organizationId))(this.props.organizations));
      const itemData = `${item.address.toUpperCase()} ${itemOrgTitle ? itemOrgTitle.toUpperCase() : ''.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.includes(textData);
    });
    this.props.setFilterSpotsList(newData);
  };

  renderHeader = () => {
    return (
      <SearchBar
        round
        placeholder="Поиск..."
        value={this.props.searchText}
        onChangeText={text => this.searchFilterFunction(text)}
        lightTheme={true}
      />
    );
  };

  renderItem = ({ item }) => {
    const orgId = item.organizationId;
    const iconName = prop('iconName', find(propEq('id', orgId))(this.props.organizations));
    const orgTitle = prop('title', find(propEq('id', orgId))(this.props.organizations));
    return (
      <ListItem
        title={item.address}
        subtitle={orgTitle}
        subtitleStyle={styles.subtitle}
        titleStyle={styles.renderItemText}
        onPress={() => {
          this.unsetFilters();
          this.props.selectSpot(item.id);
          this.props.navigation.navigate('Map');
        }}
        leftElement={
         <Image
            source={iconName ? images[iconName] : images['default-org']}
            style={styles.image}
          />
        }
        rightElement={
          item.distance ? this.convertDistance(item.distance) : null
        }
      />
    );
  };

  getData() {
    Permissions.request('location').then((response) => {
      if (!this.props.connectionInfo) {
        Alert.alert('Предупреждение', 'Требуется интернет-соединение');
      }
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
          }
        );
      }
      if (response === 'denied') {
        this.props.initSpotsList();
      }
    });
  }

  onRefresh() {
    this.props.setSpotsListIsFetching(true);
    this.getData();
  }

  render() {
    if (!this.props.spotsList) {
      return null;
    }
    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.props.filteredSpots}
          renderItem={this.renderItem}
          extraData={this.props.filteredSpots}
          ListHeaderComponent={this.renderHeader}
          onRefresh={() => this.onRefresh()}
          refreshing={this.props.isFetching}
          stickyHeaderIndices={[0]}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  spots: path(['spotsReducer', 'spotsList'], state),
  filteredSpots: path(['spotsReducer', 'filterSpotsList'], state),
  spotsList: path(['spotsReducer', 'spotsList'], state),
  organizations: path(['organizationsReducer', 'organizations'], state),
  connectionInfo: path(['deviceInfoReducer', 'connectionInfo'], state),
  materials: path(['materialsReducer', 'materials'], state),
  isFetching: path(['spotsReducer', 'spotsListIsFetching'], state),
  searchText: path(['spotsReducer', 'spotsListSearchText'], state),
});

const mapDispatchToProps = {
  selectSpot,
  initSpotsList,
  initSpotsListWithGeo,
  unsetMaterialFilters,
  unsetOrganizationFilters,
  filterSpots,
  filterSpotsCount,
  unsetOrganizationFiltersFinal,
  unsetMaterialFiltersFinal,
  unsetCount,
  setSpotsList,
  setFilterSpotsList,
  setSpotsListIsFetching,
  setSpotsListSearchText
};

export default compose(
  withNavigation,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
)(SpotsList);
