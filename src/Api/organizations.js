import axios from 'axios';

export const fetchAllOrganizations = (data) => {
  return axios.get(`https://app-api-staging.cleanpath.ru/organizations?cityId=${data}`);
};
