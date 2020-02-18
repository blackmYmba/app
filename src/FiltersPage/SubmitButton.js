import React from 'react';
import { StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { path } from 'ramda';
import {
  filterSpots,
  filterSpotsCount,
  unsetCount,
  setOrganizationFiltersFinal,
  setMaterialFiltersFinal
} from '../Reducers/spots';
import { RED } from '../Colors/Colors';

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%'
  },
  button: {
    backgroundColor: RED
  }
});

class SubmitButton extends React.Component {
  handleClick = () => {
    this.props.setOrganizationFiltersFinal(this.props.organizationFilters);
    this.props.setMaterialFiltersFinal(this.props.materialFilters);
    this.props.filterSpots(this.props.materials, true);
    this.props.navigation.navigate('Map');
  };

  render() {
    if (this.props.count || this.props.count === 0) {
      return (
        <Button
          title={this.props.count !== 0 ? `Найдено точек: ${this.props.count}. Показать` : 'Точек не найдено'}
          disabled={this.props.count === 0}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          onPress={this.handleClick}
        />
      );
    }
    return null;
  }
}

const mapStateToProps = state => ({
  materials: path(['materialsReducer', 'materials'], state),
  organizations: path(['organizationsReducer', 'organizations'], state),
  materialFilters: path(['spotsReducer', 'materialFilters'], state),
  organizationFilters: path(['spotsReducer', 'organizationFilters'], state),
  materialGroupFilters: path(['spotsReducer', 'materialFilters'], state),
  count: path(['spotsReducer', 'spotsCount'], state)
});

const mapDispatchToProps = {
  filterSpots,
  filterSpotsCount,
  unsetCount,
  setOrganizationFiltersFinal,
  setMaterialFiltersFinal
};

export default compose(
  withNavigation,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SubmitButton);
