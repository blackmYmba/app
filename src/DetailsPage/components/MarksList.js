import React from 'react';
import {
  ImageBackground,
  View,
  StyleSheet
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { find, propEq } from 'ramda';
import { GREEN } from '../../Colors/Colors';

const styles = StyleSheet.create({
  imgBackground: {
    width: 47.7,
    height: 60,
    marginRight: 10,
  },
  marksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
});

const renderCrossedOutItem = (iconId, icons) => {
  if (iconId) {
    const myArray = find(propEq('id', iconId))(icons);
    const xmlUrl = myArray.svgIcon;
    return (
      <ImageBackground style={styles.imgBackground} resizeMode='contain' source={require('../../../content/rule-marks/red-X.png')}>
        <SvgXml xml={xmlUrl} height="60px" width="47.7px" />
      </ImageBackground>
    );
  }
  return null;
};

const renderItem = (iconId, icons) => {
  if (iconId) {
    const myArray = find(propEq('id', iconId))(icons);
    const xmlUrl = myArray.svgIcon;
    return (
      <SvgXml xml={xmlUrl} height="60px" width="47.7px" />
    );
  }
  return null;
};

const selectItem = (iconId, crossedOut, icons) => {
  return (
    !crossedOut ? renderItem(iconId, icons) : renderCrossedOutItem(iconId, icons)
  );
};

export default ({ crossedOut, marks, icons }) => {
  return (
    <View style={styles.marksContainer}>
      {marks.map((m) => {
        const { iconId } = m;
        return (
          <View key={iconId}>
            {selectItem(iconId, crossedOut, icons)}
          </View>
        );
      })}
    </View>
  );
};
