import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Alert
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { withNavigation } from 'react-navigation';
import { Button, CheckBox, Icon } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { compose } from 'recompose';
import moment from 'moment';
import { connect } from 'react-redux';
import { path } from 'ramda';
import ImagePicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Permissions from 'react-native-permissions';
import AndroidOpenSettings from 'react-native-android-open-settings';
import {
  setAddress,
  setAmount,
  setValidateAmount,
  setDescription,
  setContactName,
  setContactPhone,
  setEntryRestriction,
  setPrefDay,
  setShowDayPicker,
  setPrefTimeStart,
  setPrefTimeEnd,
  setShowTimeStartPicker,
  setShowTimeEndPicker,
  setImage,
  createWasteRequest
} from '../Reducers/wasterequest';
import {
  GRAY,
  RED,
  WHITE,
  DARKGRAY,
  BLUE
} from '../Colors/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10
  },
  title: {
    fontSize: 16,
    color: DARKGRAY,
    fontWeight: 'normal',
    marginBottom: 5
  },
  buttonView: {
    margin: 20,
    alignItems: 'center'
  },
  buttonTitle: {
    color: BLUE
  },
  multiInput: {
    borderColor: GRAY,
    borderWidth: 1,
    padding: 5,
    textAlign: 'left',
    width: '80%',
    minHeight: 60,
    maxHeight: 100,
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: GRAY,
    width: '80%',
    marginBottom: 15
  },
  prefDayView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  prefDayTitle: {
    marginLeft: 10,
    fontWeight: 'normal'
  },
  cancelDayStyle: {
    color: RED,
    fontWeight: 'normal'
  },
  entryRestrictionView: {
    backgroundColor: WHITE,
    borderWidth: 0,
    marginLeft: -5
  },
  entryRestrictionText: {
    fontWeight: 'normal',
  },
  centerView: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 10
  },
  prefTimesView: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center'
  },
  prefTimeTitle: {
    textAlign: 'center'
  },
  prefTimeStartView: {
    padding: 10
  },
  addressTitle: {
    marginTop: 10
  },
  photoView: {
    marginBottom: 20,
    marginTop: 20,
  },
  photoText: {
    color: BLUE
  },
  image: {
    height: 150,
    marginBottom: 20,
    marginTop: 20,
    resizeMode: 'contain',
    width: 150,
  },
  imageContainer: {
    alignItems: 'center',
  },
  infoContainer: {
    marginTop: 10,
    marginBottom: 10
  }
});

class WasteRequestFourPage extends React.Component {
  static navigationOptions = {
    headerBackTitleVisible: false,
    headerBackTitle: ''
  };

  changePhoneHandler = (number) => {
    if (number === '+7 (8') {
      return this.props.setContactPhone('7');
    }
    return this.props.setContactPhone(number);
  };

  cameraAction = () => {
    ImagePicker.openCamera({
      compressImageQuality: 0.5,
      includeExif: true
    }).then((image) => {
      this.props.setImage({ uri: image.path, width: image.width, height: image.height, mime: image.mime });
    }).catch((error) => {
      console.log(error);
    });
  };

  createWasteRequest = () => {
    const {
      deviceId,
      selectedWasteRate,
      cityId,
      address,
      longitude,
      latitude,
      description,
      contactName,
      image,
      prefDayMoment,
      prefTimeStartMoment,
      prefTimeEndMoment,
      amount,
      entryRestriction,
      connectionInfo,
      createWasteRequest,
      contactPhone
    } = this.props;
    let alertMessage = '';
    if (!image) {
      alertMessage = `${alertMessage}\nНеобходимо прикрепить фотографию`;
    }
    if (contactName.length < 2) {
      alertMessage = `${alertMessage}\nУкажите ваше имя (не меньше 2 символов)`;
    }
    if (contactPhone.length !== 18) {
      alertMessage = `${alertMessage}\nУкажите номер телефона (11 цифр)`;
    }
    if (description.length < 3) {
      alertMessage = `${alertMessage}\nУкажите описание (не меньше 3 символов)`;
    }
    if (alertMessage.length) {
      Alert.alert('Внимание', alertMessage);
    } else {
      const body = {
        deviceId,
        organizationId: selectedWasteRate.organizationId,
        cityId,
        address,
        longitude,
        latitude,
        contactName,
        text: description,
        wasteTypeId: selectedWasteRate.wastes.wasteTypeId,
        wasteRateId: selectedWasteRate.id,
        prefDateStart: prefDayMoment && prefTimeStartMoment
          ? moment(`${prefDayMoment}T${prefTimeStartMoment}`).toISOString() : null,
        prefDateEnd: prefDayMoment && prefTimeEndMoment
          ? moment(`${prefDayMoment}T${prefTimeEndMoment}`).toISOString() : null,
        amount,
        entryRestriction,
        image
      };
      if (connectionInfo) {
        createWasteRequest(body);
        Alert.alert('Ваша заявка принята', 'Спасибо!');
        this.props.navigation.navigate('Settings');
      } else { Alert.alert('Предупреждение', 'Требуется интернет-соединение'); }
    }
  };

  render() {
    const {
      address,
      selectedWasteArray,
      amount,
      selectedWasteRate,
      description,
      setDescription,
      contactName,
      contactPhone,
      entryRestriction,
      setEntryRestriction,
      prefDay,
      showDayPicker,
      setPrefDay,
      setShowDayPicker,
      setContactName,
      setPrefTimeStart,
      setPrefTimeEnd,
      prefTimeStart,
      prefTimeEnd,
      setShowTimeStartPicker,
      setShowTimeEndPicker,
      showTimeStartPicker,
      showTimeEndPicker,
      image
    } = this.props;
    const { massUnit } = selectedWasteArray.wasteType;
    const { pricePerMassUnit } = selectedWasteRate.wastes;
    return (
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>
              {`Адрес: ${address}`}
            </Text>
            <Text style={styles.title}>
              {`Тип отходов: ${selectedWasteArray.wasteType.title}`}
            </Text>
            <Text style={styles.title}>
              {`Количество: ${amount} ${massUnit}`}
            </Text>
            <Text style={styles.title}>
              {`Сумма заказа: ${Number(amount) * pricePerMassUnit} рублей`}
            </Text>
          </View>
          <View style={styles.imageContainer}>
            {image
            && <Image source={image} style={styles.image} />
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
                } else {
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
          </View>
          <View>
            <TextInput
              style={styles.input}
              onChangeText={e => setContactName(e)}
              value={contactName}
              placeholder="Ваше имя"
            />
            <TextInputMask
              keyboardType='numeric'
              maxLength={18}
              placeholder="Ваш номер телефона"
              type={'cel-phone'}
              options={{
                dddMask: '+7 (999) 999-99-99',
              }}
              style={styles.input}
              onChangeText={this.changePhoneHandler}
              value={contactPhone}
            />
            <TextInput
              style={styles.multiInput}
              onChangeText={e => setDescription(e)}
              value={description}
              multiline={true}
              numberOfLines={3}
              placeholder="Описание"
            />
            <CheckBox
              title='Ограничение въезда'
              textStyle={styles.entryRestrictionText}
              checked={entryRestriction}
              onPress={() => setEntryRestriction(!entryRestriction)}
              containerStyle={styles.entryRestrictionView}
            />
            <TouchableOpacity onPress={() => setShowDayPicker(true)}>
              <View style={styles.prefDayView}>
                <Icon
                  name='calendar'
                  type='evilicon'
                  color='#517fa4'
                  size={28}
                />
                <Text style={styles.prefDayTitle}>
                  {prefDay ? moment(prefDay).format('DD.MM.YYYY') : 'Желаемая дата'}
                </Text>
                <DateTimePicker
                  isVisible={showDayPicker}
                  onConfirm={(day) => {
                    setPrefDay(day);
                    setShowDayPicker(false);
                  }}
                  onCancel={() => setShowDayPicker(false)}
                  minimumDate={new Date()}
                  mode="date"
                  locale="ru_RU"
                  titleIOS="Выберите день"
                  confirmTextIOS="ОК"
                  cancelTextIOS="Отмена"
                  cancelTextStyle={styles.cancelDayStyle}
                />
              </View>
            </TouchableOpacity>
            {prefDay
            && (
              <View style={styles.prefTimesView}>
                <Icon
                  name='clock'
                  type='evilicon'
                  color='#517fa4'
                  size={28}
                />
                <TouchableOpacity onPress={() => setShowTimeStartPicker(true)}>
                  <View style={styles.prefTimeStartView}>
                    <Text
                      style={styles.prefTimeTitle}
                    >
                      {prefTimeStart ? moment(prefTimeStart).format('HH:mm') : '00:00'}
                    </Text>
                  </View>
                </TouchableOpacity>
                <Text>-</Text>
                <TouchableOpacity onPress={() => setShowTimeEndPicker(true)}>
                  <View style={styles.prefTimeStartView}>
                    <Text
                      style={styles.prefTimeTitle}
                    >
                      {prefTimeEnd ? moment(prefTimeEnd).format('HH:mm') : '00:00'}
                    </Text>
                  </View>
                </TouchableOpacity>
                <DateTimePicker
                  isVisible={showTimeStartPicker}
                  onConfirm={(time) => {
                    setPrefTimeStart(time);
                    setShowTimeStartPicker(false);
                  }}
                  onCancel={() => setShowTimeStartPicker(false)}
                  maximumDate={prefTimeEnd || undefined}
                  mode="time"
                  locale="ru_RU"
                  titleIOS="Укажите время"
                  confirmTextIOS="ОК"
                  cancelTextIOS="Отмена"
                  cancelTextStyle={styles.cancelDayStyle}
                  date={prefTimeStart || new Date()}
                />
                <DateTimePicker
                  isVisible={showTimeEndPicker}
                  onConfirm={(time) => {
                    setPrefTimeEnd(time);
                    setShowTimeEndPicker(false);
                  }}
                  onCancel={() => setShowTimeEndPicker(false)}
                  minimumDate={prefTimeStart || undefined}
                  mode="time"
                  locale="ru_RU"
                  titleIOS="Укажите время"
                  confirmTextIOS="ОК"
                  cancelTextIOS="Отмена"
                  cancelTextStyle={styles.cancelDayStyle}
                  date={prefTimeEnd || new Date()}
                />
              </View>
            )}
          </View>
          <View style={styles.buttonView}>
            <Button
              title="Отправить заявку"
              titleStyle={styles.buttonTitle}
              type="clear"
              onPress={() => this.createWasteRequest()}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => ({
  address: path(['wasteRequestReducer', 'address'], state),
  selectedWasteArray: path(['wasteRequestReducer', 'selectedWasteArray'], state),
  selectedWasteRate: path(['wasteRequestReducer', 'selectedWasteRate'], state),
  amount: path(['wasteRequestReducer', 'amount'], state),
  validateAmount: path(['wasteRequestReducer', 'validateAmount'], state),
  description: path(['wasteRequestReducer', 'description'], state),
  contactName: path(['wasteRequestReducer', 'contactName'], state),
  contactPhone: path(['wasteRequestReducer', 'contactPhone'], state),
  entryRestriction: path(['wasteRequestReducer', 'entryRestriction'], state),
  prefDay: path(['wasteRequestReducer', 'prefDay'], state),
  prefDayMoment: path(['wasteRequestReducer', 'prefDayMoment'], state),
  prefTimeStart: path(['wasteRequestReducer', 'prefTimeStart'], state),
  prefTimeEnd: path(['wasteRequestReducer', 'prefTimeEnd'], state),
  prefTimeStartMoment: path(['wasteRequestReducer', 'prefTimeStartMoment'], state),
  prefTimeEndMoment: path(['wasteRequestReducer', 'prefTimeEndMoment'], state),
  showDayPicker: path(['wasteRequestReducer', 'showDayPicker'], state),
  showTimeStartPicker: path(['wasteRequestReducer', 'showTimeStartPicker'], state),
  showTimeEndPicker: path(['wasteRequestReducer', 'showTimeEndPicker'], state),
  image: path(['wasteRequestReducer', 'image'], state),
  deviceId: path(['deviceInfoReducer', 'deviceId'], state),
  connectionInfo: path(['deviceInfoReducer', 'connectionInfo'], state),
  cityId: path(['citiesReducer', 'cityId'], state),
  latitude: path(['wasteRequestReducer', 'latitude'], state),
  longitude: path(['wasteRequestReducer', 'longitude'], state),
});

const mapDispatchToProps = {
  setAddress,
  setAmount,
  setValidateAmount,
  setDescription,
  setContactName,
  setContactPhone,
  setEntryRestriction,
  setPrefDay,
  setShowDayPicker,
  setPrefTimeStart,
  setPrefTimeEnd,
  setShowTimeStartPicker,
  setShowTimeEndPicker,
  setImage,
  createWasteRequest
};

export default compose(
  withNavigation,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(WasteRequestFourPage);
