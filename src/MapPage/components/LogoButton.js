import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import CpLogoIcon from '../../../content/cp-logo.png';

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40
  },
  container: {
    paddingLeft: 20
  }
});

export default () => (
  <View style={styles.container}>
    <Image source={CpLogoIcon} style={styles.image} />
  </View>
);
