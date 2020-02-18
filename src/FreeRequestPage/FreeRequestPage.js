import React, { Component } from 'react';
import {
  Text,
  Image,
  TextInput,
  Platform,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet
} from 'react-native';
import Permissions from 'react-native-permissions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  head,
  filter,
  prop,
  trim,
  path
} from 'ramda';
import { connect } from 'react-redux';
import { compose, setDisplayName, withHandlers } from 'recompose';
import { withNavigationFocus } from 'react-navigation';
import ImagePicker from 'react-native-image-crop-picker';
import AndroidOpenSettings from 'react-native-android-open-settings';
import { TextInputMask } from 'react-native-masked-text';
import { Icon } from 'react-native-elements';
import { createFreeRequest } from '../Reducers/freerequest';
import {
  BLACK,
  GRAY,
  BLUE,
  GREEN,
  WHITE
} from '../Colors/Colors';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: GRAY,
    borderRadius: 5,
    marginTop: 10,
    padding: 10
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    color: BLACK,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    height: 150,
    marginBottom: 20,
    marginTop: 20,
    resizeMode: 'contain',
    width: 150,
  },
  input: {
    borderColor: GRAY,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderWidth: 1,
    padding: 3,
    width: '100%',
    marginBottom: 15
  },
  multiInput: {
    borderColor: GRAY,
    borderWidth: 1,
    padding: 3,
    textAlign: 'left',
    width: '100%',
    minHeight: 60,
    maxHeight: 100,
    marginBottom: 15
  },
  green: {
    backgroundColor: GREEN
  },
  textButton: {
    color: WHITE
  },
  photoView: {
    marginBottom: 15,
    marginTop: 15,
  },
  photoText: {
    color: BLUE
  },
});

class FreeRequestPage extends Component {
  static navigationOptions = { headerBackTitle: 'Форма' };

  constructor(props) {
    super(props);
    this.state = {
      image: null,
      text: '',
      applicantName: '',
      applicantPhone: '',
      applicantMail: '',
      cityId: null,
      latitude: null,
      longitude: null,
      address: ''
    };
  }

  async componentDidMount() {
    const { location } = this.props.navigation.state.params;
    if (location) {
      const apiKey = 'AIzaSyCBi5ROFPG6qiCCqEsDNyiWPSm7rmxqcbA';
      const url = `https://maps.googleapis.com/maps/api/geocode/json?language=ru&latlng=${location.latitude},${location.longitude}&location_type=ROOFTOP&key=${apiKey}`;
      const response = await fetch(
        url,
        {
          method: 'GET',
        }
      );
      if (response.status >= 400) {
        throw new Error('Can not geocode');
      }
      if (!response.ok) {
        throw new Error(JSON.stringify(response.data));
      }
      const res = await response.json();
      if (res.status === 'ZERO_RESULTS') { return; }
      const { address_components: addressArray } = head(res.results);
      const { short_name: streetName } = head(filter(i => prop('types', i).some(s => s === 'route'), addressArray));
      const { short_name: houseNumber } = head(filter(i => prop('types', i).some(s => s === 'street_number'), addressArray));
      const addressText = streetName + ' ' + houseNumber;
      this.setState({ address: addressText });
      this.setState({ longitude: location.longitude });
      this.setState({ latitude: location.latitude });
    }
  }

  cameraAction = () => {
    ImagePicker.openCamera({
      compressImageQuality: 0.5,
      includeExif: true
    }).then((image) => {
      this.setState({ image: { uri: image.path, width: image.width, height: image.height, mime: image.mime }, });
    }).catch((error) => {
      console.log(error);
    });
  };

  freeRequestHandler = (body, props) => {
    if (this.props.connectionInfo) {
      props.createFreeRequest(body);
      props.navigation.goBack();
      Alert.alert('Ваша заявка принята', 'Спасибо!');
    } else { Alert.alert('Предупреждение', 'Требуется интернет-соединение'); }
  };

  changePhoneHandler = (number) => {
    if (number === '+7 (8') {
      return this.setState({ applicantPhone: '7' });
    }
    return this.setState({ applicantPhone: number });
  };

  render() {
    return (
      <KeyboardAwareScrollView>
        <View style={styles.contentContainer}>
          <Text style={styles.header}> Форма жалобы или предложения </Text>
          {this.state.image
          && <Image source={this.state.image} style={styles.image}/>
          }
          <TouchableOpacity onPress={() => {
            Permissions.check('camera').then((response) => {
              if (Platform.OS === 'ios' && response === 'denied') {
                Alert.alert(
                  'Внимание',
                  'Необходимо предоставить доступ к камере в настройках приложения',
                  [
                    {
                      text: 'Нет',
                      style: 'cancel',
                    },
                    {
                      text: 'Открыть настройки',
                      onPress: () => Permissions.openSettings()
                    }
                  ]
                );
              }
              if (response === 'restricted') {
                Alert.alert(
                  'Внимание',
                  'Необходимо предоставить доступ к камере в настройках приложения',
                  [
                    {
                      text: 'Нет',
                      style: 'cancel',
                    },
                    {
                      text: 'Открыть настройки',
                      onPress: () => AndroidOpenSettings.appDetailsSettings(),
                    }
                  ]
                );
              }
              else {
                Permissions.request('camera').then((response) => {
                  if (response === 'authorized') {
                    this.cameraAction();
                  }
                });
              }
            });
          }}>
            <View style={styles.photoView}>
              <Icon
                type="font-awesome"
                name="camera-retro"
                color={BLUE}
              />
              <Text style={styles.photoText}>
                Прикрепить фотографию
              </Text>
            </View>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            onChangeText={address => this.setState({ address })}
            value={this.state.address}
            placeholder="Адрес*"
          />
          <TextInput
            style={styles.multiInput}
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
            multiline={true}
            numberOfLines={3}
            placeholder="Описание*"
          />
          <TextInput
            style={styles.input}
            onChangeText={applicantName => this.setState({ applicantName })}
            value={this.state.applicantName}
            placeholder="Ваше имя*"
          />
          <TextInputMask
            keyboardType='numeric'
            maxLength={18}
            placeholder="Ваш номер телефона*"
            type={'cel-phone'}
            options={{
              dddMask: '+7 (999) 999-99-99',
            }}
            style={styles.input}
            onChangeText={this.changePhoneHandler}
            value={this.state.applicantPhone}
          />
          <TextInput
            style={styles.input}
            onChangeText={applicantMail => this.setState({ applicantMail: trim(applicantMail) })}
            value={trim(this.state.applicantMail)}
            placeholder="Ваш email*"
          />
          <TouchableOpacity
            style={[styles.button, styles.green]}
            onPress={() => this.props.createFreeRequestHandler(this.state, this.freeRequestHandler)}
          >
            <Text style={styles.textButton}> ОТПРАВИТЬ </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapDispatchToProps = {
  createFreeRequest,
};

const mapStateToProps = state => ({
  connectionInfo: path(['deviceInfoReducer', 'connectionInfo'], state),
  deviceId: path(['deviceInfoReducer', 'deviceId'], state),
  cities: path(['citiesReducer', 'cities'], state),
  selectedCityName: path(['citiesReducer', 'selectedCityName'], state),
  selectedCityId: path(['citiesReducer', 'selectedCityId'], state),
  cityName: path(['citiesReducer', 'cityName'], state),
  cityId: path(['citiesReducer', 'cityId'], state),
});

export default compose(
  withNavigationFocus,
  setDisplayName('FreeRequest'),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    createFreeRequestHandler: props => (state, freeRequestHandler) => {
      let alertMessage = '';
      const validMail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
      if (!state.address.length) {
        alertMessage = `${alertMessage}\nУкажите адрес`;
      }
      if (state.text.length < 3) {
        alertMessage = `${alertMessage}\nУкажите описание (не меньше 3 символов)`;
      }
      if (state.applicantName.length < 2) {
        alertMessage = `${alertMessage}\nУкажите ваше имя (не меньше 2 символов)`;
      }
      if (!state.applicantPhone.length && !state.applicantMail.length) {
        alertMessage = `${alertMessage}\nУкажите номер телефона (11 цифр) или email`;
      }
      if (
        (validMail.test(state.applicantMail)
        && state.applicantPhone.length !== 18
        && state.applicantPhone.length)
        || (state.applicantPhone.length !== 18 && state.applicantPhone.length)
      ) {
        alertMessage = `${alertMessage}\nУкажите номер телефона (11 цифр)`;
      }
      if (
        (state.applicantPhone.length === 18
        && !validMail.test(state.applicantMail)
        && state.applicantMail.length)
        || (!validMail.test(state.applicantMail) && state.applicantMail.length)
      ) {
        alertMessage = `${alertMessage}\nУкажите корректный email`;
      }
      if (alertMessage.length) {
        Alert.alert('Внимание', alertMessage);
      } else {
        const body = {
          image: state.image ? state.image : null,
          deviceId: props.deviceId,
          address: state.address,
          cityId: props.selectedCityId ? props.selectedCityId : props.cityId,
          text: state.text,
          applicantName: state.applicantName,
          applicantPhone: state.applicantPhone,
          applicantMail: state.applicantMail,
          latitude: state.latitude,
          longitude: state.longitude
        };
        freeRequestHandler(body, props);
      }
    }
  })
)(FreeRequestPage);
