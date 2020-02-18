import React from 'react';
import { Marker } from 'react-native-maps';
import { StyleSheet, Text, View } from 'react-native';
import { WHITE } from '../../Colors/Colors';

const styles = StyleSheet.create({
  view: {
    width: 31,
    height: 41,
    justifyContent: 'center',
    alignItems: 'center'
  },
  group: {
    marginTop: 7,
    flex: 1,
    fontSize: 14,
    color: WHITE,
    textAlign: 'center',
  },
});

class ClusterMarker extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { identifier: oldIdentifier } = this.props;
    const { identifier } = nextProps;
    return oldIdentifier !== identifier;
  }

  render() {
    const {
      coordinate, onPress, image, identifier, pointCount
    } = this.props;
    let counts = pointCount;
    if (pointCount.toString().length > 3) {
      const countString = pointCount.toString();
      counts = `${countString[0]}К`;
    }
    return (
      <Marker
        key={identifier}
        identificator={identifier}
        onPress={onPress}
        image={image}
        coordinate={coordinate}
        tracksViewChanges={false}
      >
        <View style={styles.view}>
          <Text style={styles.group}>{counts}</Text>
        </View>
      </Marker>
    );
  }
}

export default ClusterMarker;
