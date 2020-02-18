import axios from 'axios';

export const fetchIcons = () => axios.get('https://app-api-staging.cleanpath.ru/icons');
