import DeviceInfo from 'react-native-device-info';
import { createAction, handleActions } from 'redux-actions';

export const setConnectionInfo = createAction('Spots/CONNECTION_INFO', connectionInfo => ({ connectionInfo }));

const INITIAL_STATE = {
  deviceId: DeviceInfo.getUniqueID(),
  appVersion: DeviceInfo.getVersion(),
  connectionInfo: false
};

export default handleActions(
  {
    [setConnectionInfo]: (state, action) => {
      state.connectionInfo = action.payload.connectionInfo;
      return state;
    },
  },
  INITIAL_STATE
);

// export default (state = INITIAL_STATE) => state;
