import React from 'react';
import { withNavigation, HeaderBackButton } from 'react-navigation';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { path } from 'ramda';
import { setMaterialFiltersOld, setOrganizationFiltersOld } from '../Reducers/spots';

class HeaderRight extends React.Component {
  render() {
    return (
      <HeaderBackButton
        onPress={() => {
          this.props.setMaterialFiltersOld(this.props.materialFiltersFinal);
          this.props.setOrganizationFiltersOld(this.props.organizationFiltersFinal);
          this.props.navigation.goBack();
        }}
      />
    );
  }
}

const mapStateToProps = state => ({
  materials: path(['materialsReducer', 'materials'], state),
  materialFiltersFinal: path(['spotsReducer', 'materialFiltersFinal'], state),
  organizationFiltersFinal: path(['spotsReducer', 'organizationFiltersFinal'], state),
});

const mapDispatchToProps = {
  setMaterialFiltersOld,
  setOrganizationFiltersOld

};

export default compose(
  withNavigation,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(HeaderRight);
