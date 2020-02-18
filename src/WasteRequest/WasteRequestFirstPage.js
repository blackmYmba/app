import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import * as Progress from 'react-native-progress';
import { withNavigation } from 'react-navigation';
import { Button } from 'react-native-elements';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { path, head } from 'ramda';
import { getWasteTypes } from '../Api/wasterequest';
import {
  setAddress,
  setOldValue,
  setWasteTypes,
  setButtonVisible,
  setProgressVisible,
  setLatitude,
  setLongitude,
  setDefaultValues
} from '../Reducers/wasterequest';
import { BLUE, GRAY, GREEN, RED } from '../Colors/Colors';

const screenWidth = Dimensions.get('screen').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressInput: {
    fontSize: 16,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: GRAY,
    width: '80%',
    textAlign: 'center'
  },
  buttonView: {
    position: 'absolute',
    bottom: 20
  },
  buttonTitle: {
    color: BLUE
  },
  errorMessageView: {
    margin: 20
  },
  errorMessage: {
    color: RED
  }
});

class WasteRequestFirstPage extends React.Component {
  static navigationOptions = {
    title: 'Заявка на вывоз',
    headerTitleStyle: {
      fontWeight: 'normal',
    },
  };

  handleComplete = async () => {
    const {
      cityName,
      address,
      setWasteTypes,
      setButtonVisible,
      setProgressVisible,
      setLatitude,
      setLongitude
    } = this.props;
    const apiKey = 'AIzaSyCBi5ROFPG6qiCCqEsDNyiWPSm7rmxqcbA';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?language=ru&address=${cityName},${address}&key=${apiKey}`;
    const fetchGoogle = await fetch(
      url,
      {
        method: 'GET',
      }
    );
    const googleResp = await fetchGoogle.json();
    const locationCoords = head(googleResp.results).geometry.location;
    setLatitude(locationCoords.lat);
    setLongitude(locationCoords.lng);
    const response = await getWasteTypes(locationCoords);
    setWasteTypes(response.data);
    setButtonVisible(true);
    setProgressVisible(false);
  };

  render() {
    const {
      address,
      setOldValue,
      oldValue,
      setAddress,
      wasteTypes,
      navigation,
      buttonVisible,
      setButtonVisible,
      progressVisible,
      setProgressVisible,
      setDefaultValues
    } = this.props;
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <TextInput
          value={address}
          placeholder="Введите адрес"
          returnKeyType='go'
          onChangeText={e => setAddress(e)}
          onFocus={() => {
            setButtonVisible(false);
            setOldValue(address);
          }}
          onEndEditing={() => {
            if (address === oldValue) {
              setButtonVisible(true);
              return;
            }
            if (address === '') {
              return;
            }
            setDefaultValues();
            setProgressVisible(true);
            this.handleComplete(address);
          }}
          style={styles.addressInput}
        />
        {progressVisible ? <Progress.Bar color={GREEN} borderColor={GREEN} indeterminate={true} width={screenWidth - 80} /> : null}
        {wasteTypes !== null && wasteTypes.length && address.length && buttonVisible ? (
          <View style={styles.buttonView}>
            <Button
              title="Продолжить"
              titleStyle={styles.buttonTitle}
              type="clear"
              onPress={() => navigation.navigate('WasteRequestSecondPage')}
            />
          </View>
        ) : null}
        {wasteTypes !== null && !wasteTypes.length && address.length && buttonVisible ? (
          <View style={styles.errorMessageView}>
            <Text style={styles.errorMessage}>
              К сожалению, услуга не доступна по данному адресу
            </Text>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => ({
  address: path(['wasteRequestReducer', 'address'], state),
  oldValue: path(['wasteRequestReducer', 'oldValue'], state),
  cityName: path(['citiesReducer', 'cityName'], state),
  wasteTypes: path(['wasteRequestReducer', 'wasteTypes'], state),
  buttonVisible: path(['wasteRequestReducer', 'buttonVisible'], state),
  progressVisible: path(['wasteRequestReducer', 'progressVisible'], state),
});

const mapDispatchToProps = {
  setAddress,
  setOldValue,
  setWasteTypes,
  setButtonVisible,
  setProgressVisible,
  setLatitude,
  setLongitude,
  setDefaultValues
};

export default compose(
  withNavigation,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(WasteRequestFirstPage);
