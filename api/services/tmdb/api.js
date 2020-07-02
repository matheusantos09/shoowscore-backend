const axios = require('axios');

const apiTmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
});

module.exports =  apiTmdb;
