import React from 'react';
import {
  View, Text, Image, Linking, Alert, Switch, StyleSheet
} from 'react-native';
import { ListItem } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { path } from 'ramda';
import { setMapType } from '../Reducers/map';
import CpLogoIcon from '../../content/cp-logo.png';
import userPosition from '../Geolocation/userPosition';

const styles = StyleSheet.create({
  cityContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    maxHeight: 20
  },
  image: {
    height: 40,
    width: 40,
  },
  imageContainer: {
    paddingLeft: 20
  },
  mapTypeText: {
    fontSize: 16,
    marginRight: 10
  },
});

const cpEmail = 'mailto:cleanpathapp@gmail.com?subject=техподдержка мобильного приложения';

class SettingsPage extends React.Component {
  static navigationOptions = {
    headerBackTitle: 'Ещё',
    title: 'Ещё',
    headerTitleStyle: {
      fontWeight: 'normal',
    },
    headerLeft: (
      <View style={styles.imageContainer}>
        <Image
          source={CpLogoIcon}
          style={styles.image}
        />
      </View>
    )
  };

  constructor(props) {
    super(props);
    this.state = {
      location: null
    };
  }

  async componentDidMount() {
    const location = await userPosition();
    if (location) {
      this.setState({ location });
    }
  }

  toggleSwitch = async (value) => {
    this.props.setMapType(value);
    await AsyncStorage.setItem('mapType', String(value));
  };

  freeRequestClick = () => {
    if (this.state.location) {
      this.props.navigation.navigate('FreeRequest', { location: this.state.location });
    } else {
      Alert.alert('Предупреждение', 'Для продолжения необходимо предоставить доступ к данным о местоположении устройства');
    }
  };

  render() {
    return (
      <View>
        <ListItem
          title="О нас"
          chevron
          onPress={() => this.props.navigation.navigate('Social')}
        />
        <ListItem
          title={this.props.cityName ? `${this.props.cityName}` : 'Красноярск'}
          chevron
          onPress={() => {
            if (this.props.cities && this.props.cities.length) {
              this.props.navigation.navigate('Cities');
            } else {
              Alert.alert('Предупреждение', 'Требуется интернет-соединение');
            }
          }}
        />
        <ListItem
          title="Режим карты"
          rightElement={
            <View style={styles.cityContainer}>
             <Text style={styles.mapTypeText}>спутник</Text>
              <Switch
                onValueChange = {this.toggleSwitch}
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], paddingBottom: 10 }}
                value = {this.props.mapType}
              />
            </View>
          }
        />
        <ListItem
          title="Жалоба или предложение"
          chevron
          onPress={() => this.freeRequestClick()}
        />
        {this.props.showWasteRequest ? (
          <ListItem
            title="Заявка на вывоз"
            chevron
            onPress={() => this.props.navigation.navigate('WasteRequestFirstPage')}
          />
        ) : null }
        <ListItem
          title="Техническая поддержка"
          onPress={() => Linking.openURL(cpEmail)}
          chevron
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  appVersion: path(['deviceInfoReducer', 'appVersion'], state),
  cities: path(['citiesReducer', 'cities'], state),
  cityName: path(['citiesReducer', 'cityName'], state),
  connectionInfo: path(['deviceInfoReducer', 'connectionInfo'], state),
  mapType: path(['map', 'mapType'], state),
  showWasteRequest: path(['firebaseReducer', 'showWasteRequest'], state)
});

export default withNavigation(connect(mapStateToProps, { setMapType })(SettingsPage));
