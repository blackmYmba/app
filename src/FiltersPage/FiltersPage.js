import React from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { keys, map, pickBy, path } from 'ramda';
import { filterSpots, filterSpotsCount, unsetCount } from '../Reducers/spots';
import HeaderRight from './HeaderRight';
import HeaderLeft from './HeaderLeft';
import SubmitButton from './SubmitButton';
import { RED, BLACK } from '../Colors/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class FiltersPage extends React.Component {
  static navigationOptions = {
    title: 'Поиск',
    headerTitleStyle: {
      fontWeight: 'normal',
    },
    headerRight: <HeaderRight />,
    headerLeft: <HeaderLeft />
  };

  componentWillUnmount() {
    this.props.unsetCount();
  }

  render() {
    const organizationIds = map(Number, keys(pickBy(Boolean, this.props.organizationFilters)));
    const materialGroupIds = map(Number, keys(pickBy(Boolean, this.props.materialGroupFilters)));
    const orgCount = organizationIds.length;
    const matCount = materialGroupIds.length;
    const { organizations, materials } = this.props;
    return (
      <View style={styles.container}>
        <View>
          <ListItem
            title='Тип вторсырья'
            titleStyle={{ color: BLACK }}
            chevron={{ color: BLACK }}
            onPress={() => (materials && materials.length > 1
              ? this.props.navigation.navigate('MaterialFilters')
              : Alert.alert('Предупреждение', 'Требуется интернет-соединение'))
            }
            badge={{
              badgeStyle: { backgroundColor: RED },
              value: matCount,
              containerStyle: { opacity: matCount < 1 ? 0 : 1 }
            }}
          />
          <ListItem
            title='Организация'
            titleStyle={{ color: BLACK }}
            chevron={{ color: BLACK }}
            onPress={() => this.props.navigation.navigate('OrganizationFilters')}
            badge={{
              value: orgCount,
              badgeStyle: { backgroundColor: RED },
              containerStyle: { opacity: orgCount < 1 ? 0 : 1 }
            }}
          />
        </View>
        <SubmitButton />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  materials: path(['materialsReducer', 'materials'], state),
  organizations: path(['organizationsReducer', 'organizations'], state),
  organizationFilters: path(['spotsReducer', 'organizationFilters'], state),
  materialGroupFilters: path(['spotsReducer', 'materialFilters'], state),
  count: path(['spotsReducer', 'spotsCount'], state)
});

const mapDispatchToProps = {
  filterSpots,
  filterSpotsCount,
  unsetCount
};

export default compose(
  withNavigation,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(FiltersPage);
