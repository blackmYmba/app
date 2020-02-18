import React from 'react';
import { Button } from 'react-native-elements';
import { StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { keys, map, pickBy, path } from 'ramda';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { unsetMaterialFilters, unsetOrganizationFilters, filterSpotsCount, filterSpots } from '../Reducers/spots';
import { RED } from '../Colors/Colors';

const styles = StyleSheet.create({
  buttonContainer: {
    marginRight: 10
  },
  buttonTitle: {
    color: RED
  }
});

class HeaderRight extends React.Component {
  handleClick = () => {
    const organizationIds = map(Number, keys(pickBy(Boolean, this.props.organizationFilters)));
    const materialIds = map(Number, keys(pickBy(Boolean, this.props.materialFilters)));
    if (organizationIds.length || materialIds.length) {
      this.props.unsetMaterialFilters();
      this.props.unsetOrganizationFilters();
      this.props.filterSpotsCount(this.props.materials);
      this.props.filterSpots(this.props.materials, true);
    }
  };

  render() {
    return (
      <Button
        titleStyle={styles.buttonTitle}
        containerStyle={styles.buttonContainer}
        title="СБРОС"
        type="clear"
        onPress={() => this.handleClick()}
      />
    );
  }
}

const mapStateToProps = state => ({
  materials: path(['materialsReducer', 'materials'], state),
  materialFilters: path(['spotsReducer', 'materialFilters'], state),
  organizationFilters: path(['spotsReducer', 'organizationFilters'], state),
  cityId: path(['citiesReducer', 'cityId'], state)
});

const mapDispatchToProps = {
  unsetMaterialFilters,
  unsetOrganizationFilters,
  filterSpotsCount,
  filterSpots
};

export default compose(
  withNavigation,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(HeaderRight);
