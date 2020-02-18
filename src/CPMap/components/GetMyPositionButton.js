import React from 'react';
import {
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';
import firebase from 'react-native-firebase';
import userPosition from '../../Geolocation/userPosition';
import { WHITE, GREEN } from '../../Colors/Colors';

const styles = StyleSheet.create({
  myPositionButton: {
    flex: 1,
    position: 'absolute',
    bottom: 20,
    right: 10,
    width: 45,
    height: 45,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 50
  }
});

export default ({ animateToCoordinate }) => (
  <TouchableWithoutFeedback
    onPress={async () => {
      const coords = await userPosition();
      if (!coords) {
        Alert.alert('Предупреждение', 'Требуется доступ к геопозиции');
      } else {
        firebase.analytics().logEvent('ToMyPositionCLick');
        animateToCoordinate(coords, 500);
      }
    }}
  >
    <View style={styles.myPositionButton}>
      <Icon
        name='crosshairs'
        type='font-awesome'
        color={GREEN}
      />
    </View>
  </TouchableWithoutFeedback>
);
