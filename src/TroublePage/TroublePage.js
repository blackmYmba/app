import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';
import { compose, withHandlers } from 'recompose';
import { withNavigationFocus } from 'react-navigation';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { path } from 'ramda';
import { createTrouble } from '../Reducers/spots';
import {
  WHITE,
  BLACK,
  GREEN,
  ORANGE,
  RED,
  GRAY
} from '../Colors/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20
  },
  headerTitle: {
    marginTop: 10,
    marginBottom: 10,
    color: BLACK,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '400'
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 20
  },
  imageContainer: {
    flex: 1,
    marginRight: 10
  },
  image: {
    height: 100,
    width: 100,
    resizeMode: 'contain'
  },
  textContainer: {
    flex: 2,
    flexWrap: 'wrap'
  },
  addressText: {
    color: BLACK,
    fontSize: 16
  },
  button: {
    alignItems: 'center',
    backgroundColor: GRAY,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5
  },
  footer: {
    marginBottom: 10
  },
  textButton: {
    color: WHITE,
    fontSize: 16
  },
  green: {
    backgroundColor: GREEN
  },
  orange: {
    backgroundColor: ORANGE
  },
  red: {
    backgroundColor: RED
  },
  multiInput: {
    borderColor: GRAY,
    borderWidth: 1,
    padding: 3,
    minHeight: 60,
    maxHeight: 100,
    width: '100%',
    paddingLeft: 25,
    paddingRight: 25,
  },
});

class TroublePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      description: ''
    };
  }

  CameraAction = () => {
    ImagePicker.openCamera({
      compressImageQuality: 0.5,
      includeExif: true
    }).then((image) => {
      this.setState({ image: { uri: image.path, width: image.width, height: image.height, mime: image.mime }, });
    }).catch(() => {
      this.props.navigation.goBack();
      Alert.alert('Требуется сделать или выбрать фото');
    });
  };

  componentDidMount() {
    this.CameraAction();
  }

  componentWillUpdate(nextProps) {
    const { isFocused } = nextProps;
    const { isFocused: wasFocused } = this.props;
    if (this.props.connectionInfo && isFocused && !wasFocused) {
      this.CameraAction();
    }
  }

  render() {
    const { createTroubleHandler, selectedSpotId, selectedSpotAddress } = this.props;
    return (
      this.state.image ? (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Укажите проблему: </Text>
            <View style={styles.subHeader}>
              <View style={styles.imageContainer}>
                <Image source={this.state.image} style={styles.image} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.addressText}> {selectedSpotAddress} </Text>
              </View>
            </View>
          </View>
          <View style={styles.body}>
            <TextInput
              style={styles.multiInput}
              onChangeText={description => this.setState({ description })}
              value={this.state.description}
              numberOfLines={5}
              multiline={true}
              placeholder="Нажмите, если хотите добавить детальное описание,
              а также контактные данные для обратной связи"
            />
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.red]}
              onPress={() => (
                createTroubleHandler(
                  selectedSpotId,
                  this.state.image,
                  `КОНТЕЙНЕР ОТСУТСТВУЕТ. ${this.state.description}`
                )
              )}
            >
              <Text style={styles.textButton}> КОНТЕЙНЕР ОТСУТСТВУЕТ </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.orange]}
              onPress={() => (
                createTroubleHandler(selectedSpotId, this.state.image, `КОНТЕЙНЕР ПОВРЕЖДЕН. ${this.state.description}`)
              )}
            >
              <Text style={styles.textButton}> КОНТЕЙНЕР ПОВРЕЖДЕН </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.green]}
              onPress={() => (
                createTroubleHandler(selectedSpotId, this.state.image, `ДРУГАЯ ПРОБЛЕМА. ${this.state.description}`)
              )}
            >
              <Text style={styles.textButton}> ДРУГАЯ ПРОБЛЕМА </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
      ) : null
    );
  }
}

const mapDispatchToProps = {
  createTrouble,
};

const mapStateToProps = state => ({
  deviceId: path(['deviceInfoReducer', 'deviceId'], state),
  spotRequestOverfillView: path(['selectedSpotReducer', 'spotRequestOverfillView'], state),
  selectedSpotId: path(['selectedSpotReducer', 'selectedSpot', 'id'], state),
  selectedSpotAddress: path(['selectedSpotReducer', 'selectedSpot', 'address'], state),
  connectionInfo: path(['deviceInfoReducer', 'connectionInfo'], state),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigationFocus,
  withHandlers({
    createTroubleHandler: props => (spotId, image, description) => {
      const body = {
        spotId,
        image,
        deviceId: props.deviceId,
        description,
        type: 'TROUBLE',
      };
      if (props.connectionInfo) {
        props.createTrouble(body);
        props.navigation.goBack();
        Alert.alert(
          `Ваша заявка принята по адресу: ${props.selectedSpotAddress}`,
          'Спасибо, что держите нас в курсе!',
          [{ text: 'OK', style: 'cancel' }],
          { cancelable: false },
        );
      } else {
        Alert.alert('Предупреждение', 'Требуется интернет-соединение');
      }
    }
  })
)(TroublePage);
