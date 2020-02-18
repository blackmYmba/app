import React from 'react';
import { FlatList, Image, View, StyleSheet } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { find, path, propEq } from 'ramda';
import { setMaterialFilters, filterSpots, filterSpotsCount, setMaterialFiltersFinal } from '../Reducers/spots';
import HeaderRight from './HeaderRight';
import SubmitButton from '../FiltersPage/SubmitButton';
import { GREEN, BLACK } from '../Colors/Colors';
import { SvgXml } from 'react-native-svg';

const styles = StyleSheet.create({
  image: {
    height: 35,
    width: 35,
    resizeMode: 'contain'
  },
  flexContainer: {
    flex: 1
  },
  mainContainer: {
    flex: 0.9
  },
  secContainer: {
    flex: 0.1
  },
  icon: {
    marginRight: 10
  }
});

const images = {
  'battery-black': require('../../content/filters/battery-black.png'),
  'battery-green': require('../../content/filters/battery-green.png'),
  'beer-bottle-black': require('../../content/filters/beer-bottle-black.png'),
  'beer-bottle-green': require('../../content/filters/beer-bottle-green.png'),
  'can-black': require('../../content/filters/can-black.png'),
  'can-green': require('../../content/filters/can-green.png'),
  'hg-bulb-black': require('../../content/filters/hg-bulb-black.png'),
  'hg-bulb-green': require('../../content/filters/hg-bulb-green.png'),
  'paper-black': require('../../content/filters/paper-black.png'),
  'paper-green': require('../../content/filters/paper-green.png'),
  'water-black': require('../../content/filters/water-black.png'),
  'water-green': require('../../content/filters/water-green.png'),
  'shirt-black': require('../../content/filters/shirt-black.png'),
  'shirt-green': require('../../content/filters/shirt-green.png'),
  'shoes-black': require('../../content/filters/shoes-black.png'),
  'shoes-green': require('../../content/filters/shoes-green.png'),
  'chemical-black': require('../../content/filters/chemical-black.png'),
  'chemical-green': require('../../content/filters/chemical-green.png'),
  'dead-animals-black': require('../../content/filters/dead-animals-black.png'),
  'dead-animals-green': require('../../content/filters/dead-animals-green.png'),
  'mercury-black': require('../../content/filters/mercury-black.png'),
  'mercury-green': require('../../content/filters/mercury-green.png'),
};

class MaterialFiltersPage extends React.Component {
  static navigationOptions = {
    title: 'Что сдавать',
    headerTitleStyle: {
      fontWeight: 'normal',
    },
    headerRight: (
      <HeaderRight />
    )
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => {
    const itemId = item.id;
    const check = this.props.materialFilters[itemId];
    let xmlUrl;
    if (item.iconId) {
      const myArray = find(propEq('id', item.iconId))(this.props.icons);
      xmlUrl = myArray.svgIcon;
    }
    return (
      item.isFilterMobile
        ? <ListItem
            title={item.title}
            leftIcon={<SvgXml fill={check ? GREEN : BLACK} xml={xmlUrl} height="32px" width="32px" />}
            titleStyle={check ? { color: GREEN } : { color: BLACK }}
            onPress={() => {
              this.props.setMaterialFilters(itemId);
              this.props.filterSpotsCount(this.props.materials);
            }}
            checkmark={check ? { color: GREEN } : false}
          /> : null
    );
  };

  render() {
    return (
      <View style={styles.flexContainer}>
        <View style={styles.mainContainer}>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.props.materials}
            renderItem={this.renderItem}
            extraData={this.props.materialFilters}
          />
        </View>
        <View style={styles.secContainer}>
          <SubmitButton from='Materials'/>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  materials: path(['materialsReducer', 'materials'], state),
  materialFilters: path(['spotsReducer', 'materialFilters'], state),
  organizationFilters: path(['spotsReducer', 'organizationFilters'], state),
  count: path(['spotsReducer', 'spotsCount'], state),
  icons: path(['iconsReducer', 'icons'], state)
});

const mapDispatchToProps = {
  setMaterialFilters,
  filterSpotsCount,
  filterSpots,
  setMaterialFiltersFinal
};

export default compose(
  withNavigation,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MaterialFiltersPage);
