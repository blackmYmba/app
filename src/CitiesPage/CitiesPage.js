import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { prop, toString, path } from 'ramda';
import { setMyCity } from '../Reducers/cities';
import { GREEN, BLACK } from '../Colors/Colors';

const keyExtractor = compose(toString, prop('id'));

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  disabled: {
    opacity: 0.5
  }
});

class CitiesPage extends React.Component {
  static navigationOptions = {
    title: 'Города',
    headerTitleStyle: {
      fontWeight: 'normal',
    },
  };

  onRowPress = async (isSelected, item) => {
    if (isSelected || !item.spotsCount) {
      return;
    }
    this.props.setMyCity(item.id, item.title);
    try {
      await AsyncStorage.setItem('cityId', String(item.id));
      await AsyncStorage.setItem('cityName', item.title);
    } catch (e) {
      console.error(e);
    }
    this.props.navigation.navigate('Map');
  };

  renderItem = ({ item }) => {
    const { id, spotsCount } = item;
    const { cityId } = this.props;
    const isSelected = cityId === id;
    const titleStyle = { color: isSelected ? GREEN : BLACK };
    return (
      <ListItem
        title={item.title}
        titleStyle={titleStyle}
        onPress={() => this.onRowPress(isSelected, item)}
        rightElement={
          <Text>{spotsCount}</Text>
        }
        disabled={!spotsCount}
        disabledStyle={styles.disabled}
      />
    );
  };

  render() {
    if (!this.props.cities) { return null; }
    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={keyExtractor}
          extraData={this.props.cityId}
          data={this.props.cities}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  cities: path(['citiesReducer', 'cities'], state),
  connectionInfo: path(['deviceInfoReducer', 'connectionInfo'], state),
  cityId: path(['citiesReducer', 'cityId'], state)
});

const mapDispatchToProps = {
  setMyCity
};

export default compose(
  withNavigation,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
)(CitiesPage);
