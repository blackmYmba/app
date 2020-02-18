import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import {
  compose,
  pure,
  withProps,
  withHandlers
} from 'recompose';
import { connect } from 'react-redux';
import { path } from 'ramda';
import {
  unsetOrganizationFilters,
  unsetMaterialFilters,
  filterSpots,
  filterSpotsCount,
  unsetOrganizationFiltersFinal,
  unsetMaterialFiltersFinal
} from '../../Reducers/spots';
import { BLACK, GREEN } from '../../Colors/Colors';

const styles = StyleSheet.create({
  cityTitle: {
    fontSize: 18,
    color: BLACK,
    marginRight: 5,
  },
  cityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

const CityButton = ({ onPress, cityName }) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.cityContainer}>
        <Text style={styles.cityTitle}>
          {cityName}
        </Text>
        <Icon
          name='chevron-down'
          type='font-awesome'
          size={10}
          color={GREEN} />
      </View>
    </TouchableOpacity>
);

const mapStateToProps = state => ({
  cityId: path(['citiesReducer', 'cityId'], state),
  cityName: path(['citiesReducer', 'cityName'], state),
  cities: path(['citiesReducer', 'cities'], state) || [],
  connectionInfo: path(['deviceInfoReducer', 'connectionInfo'], state),
  myCityId: path(['citiesReducer', 'myCityId'], state),
});

const mapDispatchToProps = {
  unsetMaterialFilters,
  unsetOrganizationFilters,
  filterSpots,
  filterSpotsCount,
  unsetOrganizationFiltersFinal,
  unsetMaterialFiltersFinal
};

export default compose(
  withNavigation,
  connect(mapStateToProps, mapDispatchToProps),
  withProps(({ cityName }) => {
    return {
      cityName
    };
  }),
  withHandlers({
    onPress: ({ cities, navigation }) => () => {
      if (cities && cities.length) {
        navigation.navigate('Cities');
      } else {
        Alert.alert('Предупреждение', 'Требуется интернет-соединение');
      }
    }
  }),
  pure
)(CityButton);
