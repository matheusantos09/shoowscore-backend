import axios from 'axios';

const apiTmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
});

export default apiTmdb;
