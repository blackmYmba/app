import axios from 'axios';

export const postTrouble = (data) => {
  const url = 'https://app-api-staging.cleanpath.ru/request';
  const { uri } = data.image;
  const newData = new FormData();
  newData.append('spotId', data.spotId);
  newData.append('description', data.description);
  newData.append('deviceId', data.deviceId);
  newData.append('longitude', data.longitude);
  newData.append('latitude', data.latitude);
  newData.append('type', data.type);
  newData.append('image', {
    uri,
    type: 'image/jpeg',
    name: 'troublePhoto.jpg'
  });
  axios.post(url, newData);
};
