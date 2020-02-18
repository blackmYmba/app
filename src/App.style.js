import { StyleSheet } from 'react-native';
import { GRAY } from './Colors/Colors';

export default StyleSheet.create({
  container: {
    marginTop: 10,
    flex: 1
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 0,
    marginBottom: 0,
    borderTopWidth: 1,
    borderTopColor: GRAY
  }
});
