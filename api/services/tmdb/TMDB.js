// const {delay} = require('bluefeather');

import apiTmdb from './api';

class TMDB {
  constructor(apiKey, language = 'en') {
    this.apiKey = apiKey;
    this.language = language;
  }

  async get(resource, parameters = {}) {
    // while (true) {
    // @TODO Trar melhor quando não encontrar o resultado na api do TMDB e devovler 404
    try {
      const response = await apiTmdb
        .get(`https://api.themoviedb.org/3/${resource}`, {
          params: {
            api_key: this.apiKey,
            ...parameters,
          },
        })
        // .then(resp => resp)
        .catch((error) => {
          // const errorResponse = error.response;

          // if (!String(errorResponse.status).startsWith('2')) {
          // if (errorResponse.headers['x-ratelimit-remaining']) {
          // const rateLimitRemaining = Number(errorResponse.headers['x-ratelimit-remaining']);

          // if (!rateLimitRemaining) {
          //   const currentTime = Math.round(new Date().getTime() / 1000);
          //   const rateLimitReset = Number(errorResponse.headers['x-ratelimit-reset']);

          // // The minimum 30 seconds cooldown ensures that in case 'x-ratelimit-reset'
          // // time is wrong, we don't bombard the TMDb server with requests.
          // // const cooldownTime = Math.max(rateLimitReset - currentTime, 30);

          // log.debug('reached rate limit; waiting %d seconds', cooldownTime);

          // await delay(cooldownTime * 1000);

          // continue;
          // }
          // }

          /* if (errorResponse.statusCode === 404) {
            throw new NotFoundError();
          } */

          /* throw new RemoteError(errorResponse.body.status_message, response.body.status_code); */
          // }

          // Error 😨
          if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            console.log(error.request);
          } else {
            // Something happened in setting up the request and triggered an Error
            console.log('Error', error.message);
          }

          throw {
            code: error.response.status,
            message: error.message,
            payload: error.response.data,
          };
        });

      console.log('response');
      console.log(response);

      return response.data;
    } catch (e) {
      console.log('ERROR:', e);
    }
    // }
  }
}

export default new TMDB()
