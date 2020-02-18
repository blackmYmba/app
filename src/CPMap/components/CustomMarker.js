import React from 'react';
import { Marker } from 'react-native-maps';

class CustomMarker extends React.Component {
  constructor() {
    super();
    this.state = {
      tracksViewChanges: true,
    };
  }

  componentDidUpdate() {
    if (this.state.tracksViewChanges) {
      this.setState(() => ({
        tracksViewChanges: false,
      }));
    }
  }

  shouldComponentUpdate(nextProps) {
    const { identifier: oldIdentifier, image: oldImage } = this.props;
    const { identifier, image } = nextProps;
    return oldIdentifier !== identifier || oldImage !== image;
  }

  render() {
    const {
      coordinate, onPress, image, identifier
    } = this.props;
    return (
      <Marker
        key={identifier}
        identificator={identifier}
        onPress={onPress}
        image={image}
        coordinate={coordinate}
        tracksViewChanges={this.state.tracksViewChanges}
      />
    );
  }
}

export default CustomMarker;
