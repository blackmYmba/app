import axios from 'axios';

export const fetchAllMaterials = () => axios.get('https://app-api-staging.cleanpath.ru/materials');
