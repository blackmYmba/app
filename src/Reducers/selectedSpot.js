import { createAction, handleActions } from 'redux-actions';

const INITIAL_STATE = {
  selectedSpot: null,
  spotDetailedView: false,
  spotRequestOverfillView: false,
  spotTroubleView: false,
  spotRequestConfirmView: false,
  spotRequestConfirmType: ''
};

export const setTroubleRights = createAction(
  'SelectedSpot/SET_TROUBLE_RIGHT',
  troubleRight => ({
    troubleRight
  })
);

export const setRequestRights = createAction(
  'SelectedSpot/SET_REQUEST_RIGHT',
  requestRight => ({
    requestRight
  })
);

export const setSelectedSpot = createAction(
  'SelectedSpot/SET_SELECTED_SPOT',
  spot => ({
    spot
  })
);

export const setDetailedView = createAction(
  'SelectedSpot/DETAILED_VIEW',
  detailedViewFlag => ({
    detailedViewFlag
  })
);

export const setRequestOverfillView = createAction(
  'SelectedSpot/REQUEST_OVERFILL_VIEW',
  (spotRequestOverfillFlag, type) => ({
    spotRequestOverfillFlag, type
  })
);

export const setTroubleView = createAction(
  'SelectedSpot/TROUBLE_VIEW',
  spotTroubleFlag => ({
    spotTroubleFlag
  })
);

export const setRequestConfirmView = createAction(
  'SelectedSpot/REQUEST_CONFIRM_VIEW',
  (spotRequestConfirmFlag, type) => ({
    spotRequestConfirmFlag, type
  })
);

const reducer = handleActions(
  {
    [setSelectedSpot]: (state, action) => {
      state.selectedSpot = action.payload.spot;
      return state;
    },
    [setDetailedView]: (state, action) => {
      state.spotDetailedView = action.payload.detailedViewFlag;
      return state;
    },
    [setRequestOverfillView]: (state, action) => {
      state.spotRequestOverfillType = action.payload.type;
      state.spotRequestOverfillView = action.payload.spotRequestOverfillFlag;
      return state;
    },
    [setTroubleView]: (state, action) => {
      state.spotTroubleView = action.payload.spotTroubleFlag;
      return state;
    },
    [setRequestConfirmView]: (state, action) => {
      state.spotRequestConfirmType = action.payload.type;
      state.spotRequestConfirmView = action.payload.spotRequestConfirmFlag;
      return state;
    },
    [setTroubleRights]: (state, action) => {
      state.selectedSpot.userRights.postTrouble = action.payload.troubleRight;
      return state;
    },
    [setRequestRights]: (state, action) => {
      state.selectedSpot.userRights.postRequest = action.payload.requestRight;
      return state;
    }
  },
  INITIAL_STATE
);

export default reducer;
