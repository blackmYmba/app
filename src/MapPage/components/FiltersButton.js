import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { withBadge, Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { compose, pure, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import { keys, map, pickBy, path } from 'ramda';
import { GREEN } from '../../Colors/Colors';

const styles = StyleSheet.create({
  badgeIcon: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: 40,
    textAlign: 'center'
  }
});

const CityButton = ({ onPress, BadgedIcon }) => (
    <TouchableOpacity
      style={styles.badgeIcon}
      onPress={onPress}
    >
      <BadgedIcon
        name='filter'
        type='font-awesome'
        color={GREEN}
        iconStyle={styles.icon}
      />
    </TouchableOpacity>
);

const mapStateToProps = state => ({
  organizations: path(['spotsReducer', 'organizationFilters'], state),
  materialGroups: path(['spotsReducer', 'materialFilters'], state),
});

export default compose(
  withNavigation,
  connect(mapStateToProps),
  withProps(({ organizations, materialGroups }) => {
    const organizationIds = map(Number, keys(pickBy(Boolean, organizations)));
    const materialGroupIds = map(Number, keys(pickBy(Boolean, materialGroups)));
    const count = +Boolean(organizationIds && organizationIds.length)
      + +Boolean(materialGroupIds && materialGroupIds.length);
    const BadgedIcon = withBadge(count, { hidden: count < 1, right: 0, top: -5 })(Icon);
    return {
      BadgedIcon
    };
  }),
  withHandlers({
    onPress: ({ navigation }) => () => {
      navigation.navigate('Filters');
    }
  }),
  pure
)(CityButton);
