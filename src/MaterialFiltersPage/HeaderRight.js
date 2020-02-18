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
import { unsetMaterialFilters, filterSpotsCount } from '../Reducers/spots';
import { RED } from '../Colors/Colors';

const styles = StyleSheet.create({
  buttonContainer: {
    marginRight: 10
  },
  buttonText: {
    color: RED
  }
});

class HeaderRight extends React.Component {
  handleClick = () => {
    const materialIds = map(Number, keys(pickBy(Boolean, this.props.materialFilters)));
    if (materialIds.length) {
      this.props.unsetMaterialFilters();
      this.props.filterSpotsCount(this.props.materials);
    }
  };

  render() {
    return (
      <Button
        titleStyle={styles.buttonText}
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
});

const mapDispatchToProps = {
  unsetMaterialFilters,
  filterSpotsCount
};

export default compose(
  withNavigation,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(HeaderRight);
