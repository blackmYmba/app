import { createAction, handleActions } from 'redux-actions';
import { Alert } from 'react-native';
import { find, path, pathEq } from 'ramda';
import moment from 'moment';

const INITIAL_STATE = {
  address: '',
  oldValue: '',
  description: '',
  contactName: '',
  contactPhone: '',
  selectedWasteArray: [],
  selectedWasteRate: {},
  validateAmount: true,
  entryRestriction: false,
  showDayPicker: false,
  image: null,
  wasteTypes: null,
  buttonVisible: false,
  progressVisible: false
};

export const setButtonVisible = createAction('WASTE_REQUEST/SET_BUTTON_VISIBLE', buttonVisible => ({ buttonVisible }));
export const setProgressVisible = createAction(
  'WASTE_REQUEST/SET_PROGRESS_VISIBLE',
  progressVisible => ({ progressVisible })
);
export const createWasteRequest = createAction('WASTE_REQUEST/CREATE_WASTE_REQUEST', wasteRequest => (wasteRequest));
export const setLongitude = createAction('WASTE_REQUEST/SET_LONGITUDE', longitude => ({ longitude }));
export const setLatitude = createAction('WASTE_REQUEST/SET_LATITUDE', latitude => ({ latitude }));
export const setAddress = createAction('WASTE_REQUEST/SET_ADDRESS', address => ({ address }));
export const setOldValue = createAction('WASTE_REQUEST/SET_OLD_VALUE', oldValue => ({ oldValue }));
export const setWasteTypes = createAction('WASTE_REQUEST/SET_WASTE_TYPES', wasteTypes => ({ wasteTypes }));
export const setPrefDay = createAction('WASTE_REQUEST/SET_PREF_DAY', prefDay => ({ prefDay }));
export const setImage = createAction('WASTE_REQUEST/SET_IMAGE', image => ({ image }));
export const setShowDayPicker = createAction('WASTE_REQUEST/SET_SHOW_DAY_PICKER', showDayPicker => ({ showDayPicker }));
export const setPrefTimeStart = createAction('WASTE_REQUEST/SET_PREF_TIME_START', prefTimeStart => ({ prefTimeStart }));
export const setShowTimeStartPicker = createAction(
  'WASTE_REQUEST/SET_SHOW_TIME_START_PICKER',
  showTimeStartPicker => ({ showTimeStartPicker })
);
export const setShowTimeEndPicker = createAction(
  'WASTE_REQUEST/SET_SHOW_TIME_END_PICKER',
  showTimeEndPicker => ({ showTimeEndPicker })
);
export const setPrefTimeEnd = createAction('WASTE_REQUEST/SET_PREF_TIME_END', prefTimeEnd => ({ prefTimeEnd }));
export const setDescription = createAction('WASTE_REQUEST/SET_DESCRIPTION', description => ({ description }));
export const setEntryRestriction = createAction(
  'WASTE_REQUEST/SET_ENTRY_RESTRICTION',
  entryRestriction => ({ entryRestriction })
);
export const setContactName = createAction('WASTE_REQUEST/SET_CONTACT_NAME', contactName => ({ contactName }));
export const setContactPhone = createAction('WASTE_REQUEST/SET_CONTACT_PHONE', contactPhone => ({ contactPhone }));
export const setSelectedWasteArray = createAction(
  'WASTE_REQUEST/SET_SELECTED_WASTE_TYPE',
  selectedWasteArray => ({ selectedWasteArray })
);
export const setAmount = createAction('WASTE_REQUEST/SET_AMOUNT', amount => ({ amount }));
export const setValidateAmount = createAction(
  'WASTE_REQUEST/SET_VALIDATE_AMOUNT',
  validateAmount => ({ validateAmount })
);
export const setDefaultValues = createAction('WASTE_REQUEST/SET_DEFAULT_VALUES');

export default handleActions(
  {
    [setDefaultValues]: (state) => {
      const minAmount = path(['selectedWasteRate', 'wastes', 'minAmount'], state);
      state.image = null;
      state.contactName = '';
      state.contactPhone = '';
      state.description = '';
      state.entryRestriction = false;
      state.prefDay = null;
      state.prefTimeStart = null;
      state.prefTimeEnd = null;
      if (minAmount) {
        state.amount = JSON.stringify(minAmount);
      }
      return state;
    },
    [setLongitude]: (state, action) => {
      state.longitude = action.payload.longitude;
      return state;
    },
    [setLatitude]: (state, action) => {
      state.latitude = action.payload.latitude;
      return state;
    },
    [setProgressVisible]: (state, action) => {
      state.progressVisible = action.payload.progressVisible;
      return state;
    },
    [setButtonVisible]: (state, action) => {
      state.buttonVisible = action.payload.buttonVisible;
      return state;
    },
    [setImage]: (state, action) => {
      state.image = action.payload.image;
      return state;
    },
    [setShowTimeStartPicker]: (state, action) => {
      state.showTimeStartPicker = action.payload.showTimeStartPicker;
      return state;
    },
    [setShowTimeEndPicker]: (state, action) => {
      state.showTimeEndPicker = action.payload.showTimeEndPicker;
      return state;
    },
    [setPrefTimeStart]: (state, action) => {
      if (state.prefTimeEnd) {
        let a = moment(action.payload.prefTimeStart);
        let b = moment(state.prefTimeEnd);
        if (a.diff(b) < 0) {
          state.prefTimeStart = action.payload.prefTimeStart;
          state.prefTimeStartMoment = moment(action.payload.prefTimeStart).format('HH:mm');
        }
      } else {
        state.prefTimeStart = action.payload.prefTimeStart;
        state.prefTimeStartMoment = moment(action.payload.prefTimeStart).format('HH:mm');
      }
      return state;
    },
    [setPrefTimeEnd]: (state, action) => {
      if (state.prefTimeStart) {
        let a = moment(state.prefTimeStart);
        let b = moment(action.payload.prefTimeEnd);
        if (a.diff(b) < 0) {
          state.prefTimeEnd = action.payload.prefTimeEnd;
          state.prefTimeEndMoment = moment(action.payload.prefTimeEnd).format('HH:mm');
        }
      } else {
        state.prefTimeEnd = action.payload.prefTimeEnd;
        state.prefTimeEndMoment = moment(action.payload.prefTimeEnd).format('HH:mm');
      }
      return state;
    },
    [setPrefDay]: (state, action) => {
      state.prefDay = action.payload.prefDay;
      state.prefDayMoment = moment(action.payload.prefDay).format('DD.MM.YYYY');
      return state;
    },
    [setShowDayPicker]: (state, action) => {
      state.showDayPicker = action.payload.showDayPicker;
      return state;
    },
    [setEntryRestriction]: (state, action) => {
      state.entryRestriction = action.payload.entryRestriction;
      return state;
    },
    [setContactPhone]: (state, action) => {
      state.contactPhone = action.payload.contactPhone;
      return state;
    },
    [setContactName]: (state, action) => {
      state.contactName = action.payload.contactName;
      return state;
    },
    [setDescription]: (state, action) => {
      state.description = action.payload.description;
      return state;
    },
    [setAmount]: (state, action) => {
      state.amount = action.payload.amount;
      return state;
    },
    [setValidateAmount]: (state, action) => {
      state.validateAmount = action.payload.validateAmount;
      return state;
    },
    [setAddress]: (state, action) => {
      state.address = action.payload.address;
      return state;
    },
    [setOldValue]: (state, action) => {
      state.oldValue = action.payload.oldValue;
      return state;
    },
    [setWasteTypes]: (state, action) => {
      state.wasteTypes = action.payload.wasteTypes;
      return state;
    },
    [setSelectedWasteArray]: (state, action) => {
      state.selectedWasteArray = action.payload.selectedWasteArray;
      const wasteRate = find(pathEq(['wastes', 'wasteTypeId'], state.selectedWasteArray.wasteType.id))(state.selectedWasteArray.wasteRate);
      state.selectedWasteRate = wasteRate;
      return state;
    },
  },
  INITIAL_STATE
);
