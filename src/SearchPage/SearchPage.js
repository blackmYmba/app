import React from 'react';
import { compose } from 'ramda';
import { setStatic, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { setMarker } from '../Reducers/map';
import { DARKGRAY } from '../Colors/Colors';

const SearchPage = ({ showPlace }) => (
  <GooglePlacesAutocomplete
    placeholder='Введите адрес...'
    minLength={3}
    autoFocus={true}
    returnKeyType={'search'}
    onPress={showPlace}
    fetchDetails={true}
    keyboardAppearance={'light'}
    listViewDisplayed='false'
    styles={{
      poweredContainer: {
        display: 'none'
      },
      powered: {
        display: 'none'
      },
      description: {
        fontWeight: 'bold'
      },
      textInputContainer: {
        backgroundColor: 'rgba(0,0,0,0)',
        borderTopWidth: 0,
        borderBottomWidth: 0
      },
      textInput: {
        marginLeft: 0,
        marginRight: 0,
        height: 38,
        color: DARKGRAY,
        fontSize: 16
      },
      predefinedPlacesDescription: {
        color: '#1faadb'
      },
    }}
    currentLocation={false}
    query={{
      key: 'AIzaSyCBi5ROFPG6qiCCqEsDNyiWPSm7rmxqcbA',
      language: 'ru',
      components: 'country:ru',
    }}
    renderDescription={row => <Text>{row.description}</Text>}
  />
);

const mapDispatchToProps = {
  setMarker
};

export default compose(
  connect(undefined, mapDispatchToProps),
  withNavigation,
  setStatic(
    'navigationOptions',
    {
      title: 'Найти адрес',
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }
  ),
  withHandlers({
    showPlace: p => (data, details) => {
      if (!details || !details.geometry || !details.geometry.location) { return; }
      const { lat: latitude, lng: longitude } = details.geometry.location;
      const marker = {
        latitude,
        longitude
      };
      p.setMarker(marker);
      p.navigation.navigate('Map');
    }
  })
)(SearchPage);
