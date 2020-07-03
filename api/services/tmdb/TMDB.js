const {delay} = require('bluefeather');

const apiTmdb = require('./api');


module.exports = class TMDB {

  constructor(apiKey, language = 'en') {
    this.apiKey = apiKey;
    this.language = language;
  }

  async get(resource, parameters = {}) {

    // while (true) {
      const response = await apiTmdb.get(resource, {
        params: {
          api_key: this.apiKey,
          ...(parameters),
        }
      })
        // .then(resp => resp)
        .catch(err => console.warn('GET API ERROR: ', err));

      console.log(response)

      if (!String(response.status).startsWith('2')) {
        if (response.headers['x-ratelimit-remaining']) {
          const rateLimitRemaining = Number(response.headers['x-ratelimit-remaining']);

          if (!rateLimitRemaining) {
            const currentTime = Math.round(new Date().getTime() / 1000);
            const rateLimitReset = Number(response.headers['x-ratelimit-reset']);

            // The minimum 30 seconds cooldown ensures that in case 'x-ratelimit-reset'
            // time is wrong, we don't bombard the TMDb server with requests.
            const cooldownTime = Math.max(rateLimitReset - currentTime, 30);

            // log.debug('reached rate limit; waiting %d seconds', cooldownTime);

            await delay(cooldownTime * 1000);

            // continue;
          }
        }

        /*if (response.statusCode === 404) {
          throw new NotFoundError();
        }*/

        /*throw new RemoteError(response.body.status_message, response.body.status_code);*/
      }

      return response.data
    // }
  }
}
