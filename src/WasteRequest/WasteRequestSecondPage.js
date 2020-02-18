import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { ListItem, Icon } from 'react-native-elements';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { path, find, propEq } from 'ramda';
import { SvgXml } from 'react-native-svg';
import { setSelectedWasteArray } from '../Reducers/wasterequest';
import { BLACK, DARKGRAY } from '../Colors/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addressTitle: {
    color: DARKGRAY,
    fontSize: 16
  },
  typeTitle: {
    fontSize: 16,
    color: DARKGRAY
  },
  icon: {
    marginRight: 10
  }
});

class WasteRequestSecondPage extends React.Component {
  static navigationOptions = {
    title: '',
    headerBackTitleVisible: false,
    headerBackTitle: ''
  };

  wasteTypePress = async (item) => {
    await this.props.setSelectedWasteArray(item);
    this.props.navigation.navigate('WasteRequestThirdPage');
  };

  render() {
    const { address, wasteTypes, icons } = this.props;
    return (
      <View style={styles.container}>
        <ListItem
          title={`Адрес: ${address}`}
          titleStyle={styles.addressTitle}
        />
        <ListItem
          title="Выберите тип отходов:"
          titleStyle={styles.typeTitle}
        />
        {wasteTypes && wasteTypes.length
          ? wasteTypes.map((i) => {
            let xmlUrl;
            if (i.wasteType.iconId) {
              const myArray = find(propEq('id', i.wasteType.iconId))(icons);
              xmlUrl = myArray.svgIcon;
            }
            return (
              <ListItem
                key={i._id}
                title={i.wasteType.title}
                chevron={{ color: BLACK }}
                onPress={() => this.wasteTypePress(i)}
                leftIcon={xmlUrl
                  ? <SvgXml xml={xmlUrl} height="32px" width="32px" />
                  : <Icon size={34} iconStyle={styles.icon} name="question" type="font-awesome" />
                }
              />
            );
          }) : null
        }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  address: path(['wasteRequestReducer', 'address'], state),
  wasteTypes: path(['wasteRequestReducer', 'wasteTypes'], state),
  icons: path(['iconsReducer', 'icons'], state)
});

const mapDispatchToProps = {
  setSelectedWasteArray
};

export default compose(
  withNavigation,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(WasteRequestSecondPage);
