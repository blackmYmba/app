import axios from 'axios';

export const fetchAllTimetableTypes = () => axios.get('https://app-api-staging.cleanpath.ru/timetabletypes');
