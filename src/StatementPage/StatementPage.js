import React, { Component } from 'react';
import {
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet
} from 'react-native';
import { trim, path } from 'ramda';
import { connect } from 'react-redux';
import { compose, setDisplayName, withHandlers } from 'recompose';
import { withNavigationFocus } from 'react-navigation';
import ImagePicker from 'react-native-image-crop-picker';
import { createStatement } from '../Reducers/statement';
import {
  BLACK,
  GRAY,
  GREEN,
  RED,
  WHITE
} from '../Colors/Colors';

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  error: {
    fontSize: 14,
    color: RED,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  header: {
    textAlign: 'center',
    color: BLACK,
    fontSize: 18,
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    borderColor: GRAY,
    padding: 0,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0
  },
  inputError: {
    width: '100%',
    padding: 0,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderColor: RED
  },
  multiInputError: {
    width: '100%',
    borderWidth: 1,
    marginBottom: 10,
    textAlign: 'left',
    borderColor: RED
  },
  multiInput: {
    width: '100%',
    borderColor: GRAY,
    borderWidth: 1,
    textAlign: 'left'
  },
  image: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: GRAY,
    padding: 10,
    marginTop: 10,
    borderRadius: 5
  },
  green: {
    backgroundColor: GREEN
  },
  textButton: {
    color: WHITE
  }
});

class StatementPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      address: '',
      userName: '',
      userPhone: '',
      userMail: '',
      addressError: '',
      userNameError: '',
      userPhoneError: '',
      userMailError: '',
    };
  }

  CameraAction = () => {
    ImagePicker.openCamera({
      compressImageQuality: 0.5,
      includeExif: true
    }).then((image) => {
      this.setState({ image: { uri: image.path, width: image.width, height: image.height, mime: image.mime }, });
    }).catch(() => {
      this.props.navigation.navigate('Map');
    });
  };

  validateAddress = () => {
    const { address } = this.state;
    this.setState({
      addressError:
        address.length > 3 ? null : '*Укажите адрес (более 3 символов)'
    });
  };

  validateUserName = () => {
    const { userName } = this.state;
    this.setState({
      userNameError:
        userName.length > 3 ? null : '*Укажите ваше имя (более 3 символов)'
    });
  };

  validateUserPhone = () => {
    const { userPhone } = this.state;
    this.setState({
      userPhoneError:
        userPhone.length === 11 ? null : '*Укажите номер телефона (11 цифр)'
    });
  };

  validateUserMail = () => {
    const { userMail } = this.state;
    const validMail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    this.setState({
      userMailError:
        validMail.test(userMail) ? null : '*Укажите контактный email'
    });
  };

  validateAll = () => {
    this.validateAddress();
    this.validateUserName();
    this.validateUserPhone();
    this.validateUserMail();
  };

  componentDidMount() {
    if (this.props.connectionInfo) {
      this.CameraAction();
    } else {
      this.props.navigation.navigate('Map');
      Alert.alert('Предупреждение', 'Требуется интернет-соединение');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.connectionInfo && !nextProps.connectionInfo) {
      this.props.navigation.navigate('Map');
      Alert.alert('Предупреждение', 'Требуется интернет-соединение');
    }
  }

  componentWillUpdate(nextProps) {
    const { isFocused } = nextProps;
    const { isFocused: wasFocused } = this.props;
    if (this.props.connectionInfo && isFocused && !wasFocused) {
      this.CameraAction();
    }
  }

  statementHandler = (body, props) => {
    if (this.props.connectionInfo) {
      props.createStatement(body);
      props.navigation.navigate('Map');
    } else { Alert.alert('Предупреждение', 'Требуется интернет-соединение'); }
  };

  render() {
    return (
      this.state.image ? (
        <ScrollView>
          <View style={styles.contentContainer}>
            <Text style={styles.header}> Сообщить об обнаружении несанкционированной свалки </Text>
            <Image source={this.state.image} style={styles.image}/>
            <TextInput
              style={this.state.addressError ? styles.multiInputError : styles.multiInput}
              onChangeText={address => this.setState({ address }, () => { this.validateAddress(); })}
              value={this.state.address}
              onBlur={this.validateAddress}
              multiline={true}
              numberOfLines={3}
              placeholder="Укажите, как найти место свалки (адрес, ориентиры)*"
            />
            <Text style={styles.error}> {this.state.addressError} </Text>
            <TextInput
              style={this.state.userNameError ? styles.inputError : styles.input}
              onChangeText={userName => this.setState({ userName }, () => { this.validateUserName(); })}
              value={this.state.userName}
              onBlur={this.validateUserName}
              placeholder="Имя отправителя заявки*"
            />
            <Text style={styles.error}> {this.state.userNameError} </Text>
            <TextInput
              style={this.state.userPhoneError ? styles.inputError : styles.input}
              onChangeText={
                userPhone => this.setState({ userPhone: trim(userPhone) }, () => { this.validateUserPhone(); })}
              value={trim(this.state.userPhone)}
              onBlur={this.validateUserPhone}
              placeholder="Телефон отпрвителя заявки*"
            />
            <Text style={styles.error}> {this.state.userPhoneError} </Text>
            <TextInput
              style={this.state.userMailError ? styles.inputError : styles.input}
              onChangeText={userMail => this.setState({ userMail: trim(userMail) }, () => { this.validateUserMail(); })}
              value={trim(this.state.userMail)}
              onBlur={this.validateUserMail}
              placeholder="Email отправителя заявки*"
            />
            <Text style={styles.error}> {this.state.userMailError} </Text>
            <TouchableOpacity
              style={[styles.button, styles.green]}
              onPress={() => this.state.address
                && this.state.userName
                && this.state.userPhone
                && this.state.userMail
                ? this.props.createStatementHandler(this.state, this.statementHandler)
                : this.validateAll()
              }
            >
              <Text style={styles.textButton}> ОТПРАВИТЬ ЗАЯВКУ </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>) : (null)
    );
  }
}

const mapDispatchToProps = {
  createStatement,
};

const mapStateToProps = state => ({
  connectionInfo: path(['deviceInfoReducer', 'connectionInfo'], state),
  deviceId: path(['deviceInfoReducer', 'deviceId'], state),
});

export default compose(
  withNavigationFocus,
  setDisplayName('Statement'),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    createStatementHandler: props => (state, statementHandler) => {
      const body = {
        image: state.image,
        deviceId: props.deviceId,
        address: state.address,
        userName: state.userName,
        userPhone: state.userPhone,
        userMail: state.userMail,
        type: 'STATEMENT'
      };
      statementHandler(body, props);
    }
  })
)(StatementPage);
