import axios from 'axios';

export const postRequest = (data) => {
  return axios({
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    url: 'https://app-api-staging.cleanpath.ru/request',
    data
  });
};
