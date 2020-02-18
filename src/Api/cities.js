import axios from 'axios';

export const fetchAllCities = () => axios.get('https://app-api-staging.cleanpath.ru/cities');
