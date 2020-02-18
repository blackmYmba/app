import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  Platform,
  TouchableOpacity as RNTouchableOpacity,
  StyleSheet
} from 'react-native';
import { TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler';
import { withNavigation } from 'react-navigation';
import {
  compose,
  find,
  prop,
  propEq,
  path
} from 'ramda';
import {
  pure,
  withHandlers,
  renderComponent,
  branch,
  withProps,
  defaultProps
} from 'recompose';
import { connect } from 'react-redux';
import AndroidOpenSettings from 'react-native-android-open-settings';
import Permissions from 'react-native-permissions';
import MyTimeTableComponent from './components/MyTimeTableComponent';
import { unselectSpot, createRequest } from '../Reducers/spots';
import MarksList from './components/MarksList';
import SocialList from './components/SocialList';
import {
  BLACK,
  GREEN,
  RED,
  WHITE,
  DARKGRAY
} from '../Colors/Colors';

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'column'
  },
  subHeaderText: {
    color: BLACK,
    fontSize: 18,
    fontWeight: '400'
  },
  organization: {
    fontSize: 20,
    color: DARKGRAY
  },
  address: {
    fontSize: 18,
    color: DARKGRAY
  },
  marksContainer: {
    marginTop: 20
  },
  button: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textButton: {
    color: WHITE,
    fontSize: 16
  },
  footer: {
    marginTop: 25
  },
  green: {
    backgroundColor: GREEN,
  },
  red: {
    backgroundColor: RED,
  },
});

const TouchableOpacity = Platform.select({
  ios: () => RNTouchableOpacity,
  android: () => GHTouchableOpacity,
})();

const DetailsPage = ({
  trueMarkList,
  organization,
  address,
  falseMarkList,
  commonRules,
  commonExceptions,
  facebookLink,
  website,
  phone,
  phoneSpot,
  vkLink,
  instagramLink,
  spotOverfillHandler,
  troubleHandler,
  onLayout,
  timeTableId,
  title,
  icons,
}) => (
    <View style={styles.contentContainer} onLayout={onLayout}>
      <View style={styles.header}>
        <Text style={styles.organization} adjustsFontSizeToFit={true} numberOfLines={1}>
          { title || organization }
        </Text>
        <Text style={styles.address} adjustsFontSizeToFit={true}>
          {address}
        </Text>
        {facebookLink || website || phone || phoneSpot || vkLink || instagramLink ? (
          <SocialList
            facebook={facebookLink}
            website={website}
            phone={phoneSpot || phone}
            vk={vkLink}
            instagram={instagramLink} />
        ) : null}
      </View>
      <View style={trueMarkList || commonRules ? styles.marksContainer : null}>
        {trueMarkList && trueMarkList.length ? (
          <View>
            <Text style={styles.subHeaderText}>ПРАВИЛА СДАЧИ</Text>
            <MarksList marks={ trueMarkList } crossedOut={ false } icons={icons} />
          </View>
        ) : null}
        {commonRules ? (
        <View>
          <Text style={styles.rulesText}>
            {commonRules}
          </Text>
        </View>
        ) : null}
      </View>
      <View style={falseMarkList || commonExceptions ? styles.marksContainer : null}>
        {falseMarkList && falseMarkList.length ? (
          <View>
            <Text style={styles.subHeaderText}>НЕЛЬЗЯ</Text>
            <MarksList marks={ falseMarkList } crossedOut={ true } icons={icons} />
          </View>
        ) : null}
        {commonExceptions ? (
          <View>
            <Text style={styles.rulesText}>
               {commonExceptions}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={styles.footer}>
        {timeTableId ? (
          <MyTimeTableComponent />
        ) : (
          <TouchableOpacity
            onPress = {spotOverfillHandler}
          >
            <View style={[styles.button, styles.green]}>
              <Text style={styles.textButton}>Сообщить о переполнении</Text>
            </View>

          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress = { troubleHandler }
        >
          <View style={[styles.button, styles.red]}>
            <Text style={styles.textButton}>Сообщить о проблеме</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
);

const mapDispatchToProps = { unselectSpot, createRequest };

const mapStateToProps = state => ({
  allSpots: path(['spotsReducer', 'spots'], state),
  selectedSpotId: path(['selectedSpotReducer', 'selectedSpot', 'id'], state),
  selectedSpotAddress: path(['selectedSpotReducer', 'selectedSpot', 'address'], state),
  trueMarkList: path(['selectedSpotReducer', 'selectedSpot', 'rule', 'marksTrue'], state),
  falseMarkList: path(['selectedSpotReducer', 'selectedSpot', 'rule', 'marksFalse'], state),
  commonRules: path(['selectedSpotReducer', 'selectedSpot', 'rule', 'commonRules'], state),
  commonExceptions: path(['selectedSpotReducer', 'selectedSpot', 'rule', 'commonExceptions'], state),
  organization: path(['selectedSpotReducer', 'selectedSpot', 'organization', 'title'], state),
  title: path(['selectedSpotReducer', 'selectedSpot', 'title'], state),
  address: path(['selectedSpotReducer', 'selectedSpot', 'address'], state),
  facebookLink: path(['selectedSpotReducer', 'selectedSpot', 'organization', 'facebookLink'], state),
  website: path(['selectedSpotReducer', 'selectedSpot', 'organization', 'website'], state),
  phone: path(['selectedSpotReducer', 'selectedSpot', 'organization', 'phone'], state),
  phoneSpot: path(['selectedSpotReducer', 'selectedSpot', 'phone'], state),
  vkLink: path(['selectedSpotReducer', 'selectedSpot', 'organization', 'vkLink'], state),
  instagramLink: path(['selectedSpotReducer', 'selectedSpot', 'organization', 'instagramLink'], state),
  requestRights: path(['selectedSpotReducer', 'selectedSpot', 'userRights', 'postRequest'], state),
  troubleRights: path(['selectedSpotReducer', 'selectedSpot', 'userRights', 'postTrouble'], state),
  connectionInfo: path(['deviceInfoReducer', 'connectionInfo'], state),
  deviceId: path(['deviceInfoReducer', 'deviceId'], state),
  icons: path(['iconsReducer', 'icons'], state)
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withNavigation,
  withHandlers({
    onLayout: ({ onReady }) => ({ nativeEvent: { layout: { height } } }) => {
      onReady(height);
    },
    createRequestHandler: props => (spotId, fillPercentage) => {
      const body = {
        spotId,
        type: 'REQUEST',
        fillPercentage,
        deviceId: props.deviceId
      };
      if (props.connectionInfo) {
        props.createRequest(body);
        Alert.alert(
          `Ваша заявка принята по адресу: ${props.selectedSpotAddress}`,
          'Спасибо, что держите нас в курсе!',
          [{ text: 'OK', style: 'cancel' }],
          { cancelable: false },
        );
      } else {
        Alert.alert('Предупреждение', 'Требуется интернет-соединение');
      }
    },
  }),
  withHandlers({
    spotOverfillHandler: props => () => {
      Permissions.request('location').then((response) => {
        if (response === 'authorized') {
          navigator.geolocation.getCurrentPosition(
            () => {
              if (props.connectionInfo && props.requestRights) {
                if (Platform.OS === 'ios') {
                  Alert.alert(
                    'Укажите, насколько заполнен контейнер:',
                    '',
                    [
                      { text: '80%', onPress: () => props.createRequestHandler(props.selectedSpotId, '80%') },
                      { text: '100%', onPress: () => props.createRequestHandler(props.selectedSpotId, '100%') },
                      { text: 'Более 100%', onPress: () => props.createRequestHandler(props.selectedSpotId, '200%') },
                      { text: 'Отмена', style: 'cancel' },
                    ],
                    { cancelable: false },
                  );
                } else {
                  Alert.alert(
                    '',
                    'Укажите, насколько заполнен контейнер:',
                    [
                      { text: 'Отмена', style: 'cancel' },
                      { text: '80%', onPress: () => props.createRequestHandler(props.selectedSpotId, '80%') },
                      { text: '100%', onPress: () => props.createRequestHandler(props.selectedSpotId, '200%') },
                    ],
                    { cancelable: false },
                  );
                }
              } else if (props.connectionInfo && !props.requestRights) {
                Alert.alert(
                  `Ваша заявка уже принята по адресу: ${props.selectedSpotAddress}`,
                  'Спасибо, что держите нас в курсе!',
                  [{ text: 'OK', style: 'cancel' }],
                  { cancelable: false },
                );
              } else if (!props.connectionInfo) {
                Alert.alert('Предупреждение', 'Требуется интернет-соединение');
              }
            },
            () => Alert.alert(
              'Предупреждение',
              'Для продолжения необходимо предоставить доступ к данным о местоположении устройства'
            ),
          );
        }
        if (response === 'denied') {
          Alert.alert('Предупреждение', 'Требуется доступ к геопозиции');
        }
      });
    },
    troubleHandler: props => () => {
      Permissions.request('location').then((response) => {
        if (response === 'authorized') {
          navigator.geolocation.getCurrentPosition(
            () => {
              if (props.connectionInfo && props.troubleRights) {
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
                        props.navigation.navigate('Trouble');
                      }
                    });
                  }
                });
              } else if (props.connectionInfo && !props.troubleRights) {
                Alert.alert(
                  `Ваша заявка уже принята по адресу: ${props.selectedSpotAddress}`,
                  'Спасибо, что держите нас в курсе!',
                  [{ text: 'OK', style: 'cancel' }],
                  { cancelable: false },
                );
              } else {
                Alert.alert('Предупреждение', 'Требуется интернет-соединение');
              }
            },
            () => Alert.alert(
              'Предупреждение',
              'Для продолжения необходимо предоставить доступ к данным о местоположении устройства'
            ),
          );
        }
        if (response === 'denied') {
          Alert.alert('Предупреждение', 'Требуется доступ к геопозиции');
        }
      });
    },
  }),
  branch(
    ({ selectedSpotId }) => !selectedSpotId,
    renderComponent(() => <ActivityIndicator animating={true} size={'large'} />)
  ),
  defaultProps({
    organization: ''
  }),
  withProps(({ organization, selectedSpotId, allSpots }) => ({
    organization: organization.toUpperCase(),
    timeTableId: prop('timeTableId')(find(propEq('id', selectedSpotId))(allSpots)),
  })),
  pure
)(DetailsPage);
