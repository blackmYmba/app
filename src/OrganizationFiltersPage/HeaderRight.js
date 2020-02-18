import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  compose,
  keys,
  map,
  pickBy,
  path
} from 'ramda';
import { Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { unsetOrganizationFilters, filterSpotsCount } from '../Reducers/spots';
import { RED } from '../Colors/Colors';

const styles = StyleSheet.create({
  container: {
    marginRight: 10
  },
  buttonTitle: {
    color: RED
  }
});

class HeaderRight extends React.Component {
  handleClick = () => {
    const organizationIds = map(Number, keys(pickBy(Boolean, this.props.organizationFilters)));
    if (organizationIds.length) {
      this.props.unsetOrganizationFilters();
      this.props.filterSpotsCount(this.props.materials);
    }
  };

  render() {
    if (this.props.organizationsWithFilter && !this.props.organizationsWithFilter.length) {
      return null;
    }
    return (
      <Button
        titleStyle={styles.buttonTitle}
        containerStyle={styles.container}
        title="СБРОС"
        type="clear"
        onPress={() => this.handleClick()}
      />
    );
  }
}

const mapStateToProps = state => ({
  materials: path(['materialsReducer', 'materials'], state),
  organizationFilters: path(['spotsReducer', 'organizationFilters'], state),
  organizationsWithFilter: path(['organizationsReducer', 'organizationsWithFilter'], state),
});

const mapDispatchToProps = {
  unsetOrganizationFilters,
  filterSpotsCount
};

export default compose(
  withNavigation,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(HeaderRight);
