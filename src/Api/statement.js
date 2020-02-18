import axios from 'axios';

export const postStatement = (data) => {
  const url = 'https://app-api-staging.cleanpath.ru/statement';
  const newData = new FormData();
  newData.append('address', data.address);
  newData.append('userName', data.userName);
  newData.append('userMail', data.userMail);
  newData.append('userPhone', data.userPhone);
  newData.append('type', data.type);
  newData.append('longitude', data.longitude);
  newData.append('latitude', data.latitude);
  newData.append('deviceId', data.deviceId);
  if (data.image) {
    const { uri } = data.image;
    newData.append('image', {
      uri,
      type: 'image/jpeg',
      name: 'photo.jpg'
    });
  }
  axios.post(url, newData);
};
