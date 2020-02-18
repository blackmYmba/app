import { StyleSheet } from 'react-native';
import {
  WHITE,
  DARKGRAY,
  GREEN,
  RED,
  GRAY
} from '../Colors/Colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column'
  },
  headerContainer: {

  },
  organization: {
    fontSize: 20,
    color: DARKGRAY
  },
  address: {
    fontSize: 18,
    color: DARKGRAY
  },
  marks: {
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: GRAY,
    paddingBottom: 10
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    maxWidth: 140
  },
  textButton: {
    color: WHITE,
    fontSize: 16
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 10,
    marginBottom: 10,
  },
  green: {
    backgroundColor: GREEN,
  },
  red: {
    backgroundColor: RED,
  },
});
