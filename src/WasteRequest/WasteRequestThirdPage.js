import React from 'react';
import { View, StyleSheet, TextInput, Text, Platform } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Button, ListItem, Divider } from 'react-native-elements';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { path } from 'ramda';
import { setAddress, setAmount, setValidateAmount } from '../Reducers/wasterequest';
import { GRAY, BLUE, DARKGRAY, RED } from '../Colors/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  addressTitle: {
    fontSize: 16,
    color: DARKGRAY,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5
  },
  wasteTypeTitle: {
    fontSize: 16,
    color: DARKGRAY,
    marginLeft: 10,
    marginBottom: 10
  },
  typeTitle: {
    fontSize: 16,
    color: DARKGRAY
  },
  subTypeTitle: {
    fontSize: 14,
    color: DARKGRAY
  },
  buttonView: {
    paddingBottom: 20,
    alignItems: 'center'
  },
  buttonTitle: {
    color: BLUE
  },
  amountInput: {
    alignSelf: 'center',
    fontSize: 16,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: GRAY,
    width: '80%',
    textAlign: 'center'
  },
  containerList: {
    margin: 0
  },
  redText: {
    fontSize: 14,
    color: RED
  }
});

class WasteRequestThirdPage extends React.Component {
  static navigationOptions = {
    headerBackTitleVisible: false,
    headerBackTitle: ''
  };

  componentDidMount() {
    const minAmount = path(['selectedWasteRate', 'wastes', 'minAmount'], this.props);
    if (minAmount) {
      this.props.setAmount(JSON.stringify(minAmount));
    }
  }

  handleChangeAmount = (value) => {
    if (Number(value) || value === '') {
      this.props.setAmount(value);
    }
  };

  checkValidateAmount = (value) => {
    this.props.setValidateAmount(Number(value) >= this.props.selectedWasteRate.wastes.minAmount);
  };

  render() {
    const {
      address,
      validateAmount,
      navigation,
      selectedWasteArray,
      amount,
      selectedWasteRate,
      setValidateAmount
    } = this.props;
    const { massUnit } = selectedWasteArray.wasteType;
    const { minAmount } = selectedWasteRate.wastes;
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.addressTitle}>
            {`Адрес: ${address}`}
          </Text>
          <Text style={styles.wasteTypeTitle}>
            {`Тип отходов: ${selectedWasteArray.wasteType.title}`}
          </Text>
          <ListItem
            title={`Введите количество: (${massUnit})`}
            subtitle={`Минимальное: ${minAmount} ${massUnit}`}
            titleStyle={styles.typeTitle}
            subtitleStyle={styles.subTypeTitle}
          />
          <TextInput
            value={amount}
            keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
            onFocus={() => {
              setValidateAmount(false);
            }}
            onChangeText={e => this.handleChangeAmount(e)}
            onEndEditing={() => {
              this.checkValidateAmount(amount);
            }}
            style={styles.amountInput}
          />
        </View>
        {validateAmount
        && (
          <View style={styles.buttonView}>
            <Button
              title="Продолжить"
              titleStyle={styles.buttonTitle}
              type="clear"
              onPress={() => navigation.navigate('WasteRequestFourPage')}
            />
          </View>
        )}
        {!validateAmount
        && (
          <View style={styles.buttonView}>
            <Text style={styles.redText}>{`Минимальное количество: ${minAmount} ${massUnit}`}</Text>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  address: path(['wasteRequestReducer', 'address'], state),
  selectedWasteArray: path(['wasteRequestReducer', 'selectedWasteArray'], state),
  selectedWasteRate: path(['wasteRequestReducer', 'selectedWasteRate'], state),
  amount: path(['wasteRequestReducer', 'amount'], state),
  validateAmount: path(['wasteRequestReducer', 'validateAmount'], state),
});

const mapDispatchToProps = {
  setAddress,
  setAmount,
  setValidateAmount
};

export default compose(
  withNavigation,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(WasteRequestThirdPage);
