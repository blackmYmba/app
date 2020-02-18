import axios from 'axios';

export const postFreeRequest = (data) => {
  const url = 'https://app-api-staging.cleanpath.ru/freetyperequest';
  const newData = new FormData();
  newData.append('deviceId', data.deviceId);
  newData.append('cityId', data.cityId);
  newData.append('address', data.address);
  newData.append('longitude', data.longitude);
  newData.append('latitude', data.latitude);
  newData.append('applicantName', data.applicantName);
  if (data.applicantPhone) { newData.append('applicantPhone', data.applicantPhone); }
  if (data.applicantMail) { newData.append('applicantMail', data.applicantMail); }
  newData.append('text', data.text);
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
