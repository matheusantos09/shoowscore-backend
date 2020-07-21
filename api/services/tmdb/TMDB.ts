import apiTmdb from './api';

class TMDB {

  public apiKey: string;
  public language: string;
  public baseUri: string;
  public imagesUri: string;
  public timeout: number;

  constructor ( apiKey, language = 'en-US' ) {
    this.apiKey = apiKey;
    this.language = language;
    this.baseUri = "http://api.themoviedb.org/3/";
    this.imagesUri = "http://image.tmdb.org/t/p/";
    this.timeout = 10000;
  }

  async prepareQuerySearch ( options = {} ) {

    let query = "?api_key=" + this.apiKey + "&language=" + this.language;

    if (Object.keys(options).length) {
      Object.keys(options).map(option => {
        if (options.hasOwnProperty(option) && option !== "id" && option !== "body") {
          query = query + "&" + option + "=" + options[option];
        }
      })
    }

    return query;
  }

  async validateCallbacks ( success, error ) {
    if (typeof success !== "function" || typeof error !== "function") {
      throw "success and error parameters must be functions!";
    }
  }

  async validateRequired ( args, argsReq, opt, optReq, allOpt = false ) {

    if (args.length !== argsReq) {
      throw "The method requires  " + argsReq + " arguments and you are sending " + args.length + "!";
    }

    if (allOpt) {
      return;
    }

    if (argsReq > 2) {
      for (let i = 0; i < optReq.length; i = i + 1) {
        if (!opt.hasOwnProperty(optReq[i])) {
          throw optReq[i] + " is a required parameter and is not present in the options!";
        }
      }
    }
  }

}

export default TMDB
