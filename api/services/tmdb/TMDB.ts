import apiTmdb from './api';

class TMDB {

  public apiKey: string;
  public language: string;

  constructor ( apiKey, language = 'en' ) {
    this.apiKey = apiKey;
    this.language = language;
  }

  async get ( resource, parameters = {} ) {
    // while (true) {
    // @TODO Trar melhor quando não encontrar o resultado na api do TMDB e devovler 404
    try {
      const response = await apiTmdb
        .get(`https://api.themoviedb.org/3/${ resource }`, {
          params: {
            api_key: this.apiKey,
            ...parameters,
          },
        })
        .catch(( error ) => {

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
            results: error.response.data,
          };
        });

      // console.log('response');
      // console.log(response);

      return response.data;
    } catch (e) {
      console.log('ERROR:', e);
    }
    // }
  }
}

export default TMDB
