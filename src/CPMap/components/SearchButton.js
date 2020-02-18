import React from 'react';
import {
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';
import { compose, pure, withHandlers } from 'recompose';
import { withNavigation } from 'react-navigation';
import { WHITE, GREEN } from '../../Colors/Colors';

const styles = StyleSheet.create({
  searchButton: {
    position: 'absolute',
    bottom: 120,
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

const SearchButton = ({ onPress }) => (
  <TouchableWithoutFeedback
    onPress={onPress}
  >
    <View style={styles.searchButton}>
      <Icon
        name='search'
        type='font-awesome'
        color={GREEN}
      />
    </View>
  </TouchableWithoutFeedback>
);

export default compose(
  withNavigation,
  withHandlers({
    onPress: ({ navigation, connectionInfo }) => () => {
      if (!connectionInfo) {
        Alert.alert('Предупреждение', 'Требуется интернет-соединение');
        return;
      }
      navigation.navigate('Search');
    }
  }),
  pure
)(SearchButton);
