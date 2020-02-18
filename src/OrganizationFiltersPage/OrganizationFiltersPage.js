import React from 'react';
import { FlatList, Image, View, StyleSheet, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { path } from 'ramda';
import { setOrganizationFilters, filterSpots, filterSpotsCount } from '../Reducers/spots';
import HeaderRight from './HeaderRight';
import SubmitButton from '../FiltersPage/SubmitButton';
import { GREEN, BLACK, DARKGRAY } from '../Colors/Colors';

export const images = {
  'default-org': require('../../content/organizations/default-org.png'),
  'good-caps': require('../../content/organizations/good-caps.png'),
  'green-squad': require('../../content/organizations/green-squad.png'),
  'leroy-merlin': require('../../content/organizations/leroy-merlin.png'),
  recycling: require('../../content/organizations/recycling.png'),
  hm: require('../../content/organizations/hm.png'),
  'rendez-vous': require('../../content/organizations/rendez-vous.png'),
  krk: require('../../content/organizations/krk.png'),
  ecodvor: require('../../content/organizations/ecodvor.png'),
  termika: require('../../content/organizations/termika.png'),
};

const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 40,
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
  withZeroOrg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  withZeroOrgView: {
    maxWidth: '50%'
  },
  withZeroOrgText: {
    color: DARKGRAY,
    fontSize: 16,
    textAlign: 'center'
  }
});

class OrganizationFiltersPage extends React.Component {
  static navigationOptions = {
    title: 'Куда сдавать',
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
    const check = this.props.organizationFilters[itemId];
    return (
      <ListItem
        title={item.title}
        titleStyle={check ? { color: GREEN } : { color: BLACK }}
        onPress={() => {
          this.props.setOrganizationFilters(itemId);
          this.props.filterSpotsCount(this.props.materials);
        }}
        checkmark={ check ? { color: GREEN } : false}
        leftElement={
          <Image
            source={item.iconName ? images[item.iconName] : images['default-org']}
            style={styles.image}
          />
        }
      />
    );
  };

  render() {
    const { organizationFilters, organizationsWithFilter } = this.props;
    if (organizationsWithFilter && !organizationsWithFilter.length) {
      return (
        <View style={styles.withZeroOrg}>
          <View style={styles.withZeroOrgView}>
            <Text style={styles.withZeroOrgText}>
              Фильтр по организациям временно не доступен
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.flexContainer}>
        <View style={styles.mainContainer}>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={organizationsWithFilter}
            renderItem={this.renderItem}
            extraData={organizationFilters}
          />
        </View>
        <View style={styles.secContainer}>
          <SubmitButton from='Organizations' />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  materials: path(['materialsReducer', 'materials'], state),
  organizations: path(['organizationsReducer', 'organizations'], state),
  organizationsWithFilter: path(['organizationsReducer', 'organizationsWithFilter'], state),
  organizationFilters: path(['spotsReducer', 'organizationFilters'], state),
  materialFilters: path(['spotsReducer', 'materialFilters'], state),
  count: path(['spotsReducer', 'spotsCount'], state)
});

const mapDispatchToProps = {
  setOrganizationFilters,
  filterSpotsCount,
  filterSpots
};

export default compose(
  withNavigation,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(OrganizationFiltersPage);
