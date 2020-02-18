import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { prop, toString, path } from 'ramda';
import { setSelectedCity } from '../Reducers/cities';
import { GREEN, BLACK } from '../Colors/Colors';

const keyExtractor = compose(toString, prop('id'));

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

class SelectCityPage extends React.Component {
  static navigationOptions = {
    title: 'Выберите город',
    headerTitleStyle: {
      fontWeight: 'normal',
    },
  };

  onRowPress = (isSelected, item) => {
    this.props.setSelectedCity(item.id, item.title);
    this.props.navigation.goBack();
  };

  renderItem = ({ item }) => {
    const { id } = item;
    const { selectedCityId, cityId } = this.props;
    const isSelected = selectedCityId ? selectedCityId === id : cityId === id;
    const titleStyle = { color: isSelected ? GREEN : BLACK };
    return (
      <ListItem
        title={item.title}
        titleStyle={titleStyle}
        onPress={() => this.onRowPress(isSelected, item)}
      />
    );
  };

  render() {
    if (!this.props.cities) { return null; }
    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={keyExtractor}
          extraData={this.props.selectedCityId}
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
  selectedCityName: path(['citiesReducer', 'selectedCityName'], state),
  selectedCityId: path(['citiesReducer', 'selectedCityId'], state),
  cityId: path(['citiesReducer', 'cityId'], state),
});

const mapDispatchToProps = {
  setSelectedCity
};

export default compose(
  withNavigation,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
)(SelectCityPage);
