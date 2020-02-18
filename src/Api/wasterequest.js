import axios from 'axios';

export const getWasteTypes = (data) => {
  return axios.get(`https://app-api-staging.cleanpath.ru/wastes?lng=${data.lng}3&lat=${data.lat}`);
};

export const postWasteRequest = (data) => {
  const url = 'https://app-api-staging.cleanpath.ru/wasterequest';
  const newData = new FormData();
  newData.append('deviceId', data.deviceId);
  newData.append('organizationId', data.organizationId);
  newData.append('cityId', data.cityId);
  newData.append('address', data.address);
  newData.append('longitude', data.longitude);
  newData.append('latitude', data.latitude);
  newData.append('contactName', data.contactName);
  newData.append('text', data.text);
  newData.append('wasteTypeId', data.wasteTypeId);
  newData.append('wasteRateId', data.wasteRateId);
  newData.append('amount', data.amount);
  newData.append('entryRestriction', data.entryRestriction);
  if (data.applicantPhone) { newData.append('contactPhone', data.applicantPhone); }
  if (data.prefDateStart) { newData.append('prefDateStart', data.applicantPhone); }
  if (data.prefDateEnd) { newData.append('prefDateEnd', data.applicantPhone); }
  if (data.image && data.image.uri) {
    const { uri } = data.image;
    newData.append('image', {
      uri,
      type: 'image/jpeg',
      name: 'freeRequestPhoto.jpg'
    });
  }
  axios.post(url, newData);
};
