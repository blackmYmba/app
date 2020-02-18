import axios from 'axios';

export const fetchAllSpots = (data) => {
  return axios.get(`https://app-api-staging.cleanpath.ru/spots?cityId=${data}`);
};
export const fetchSelectedSpot = (data) => {
  return axios.get(`https://app-api-staging.cleanpath.ru/spots/${data.selectedSpotId}?deviceId=${data.deviceId}`);
};
export const fetchSpotsList = (params) => {
  return axios.get(`https://app-api-staging.cleanpath.ru/spots/list${params}`);
};
