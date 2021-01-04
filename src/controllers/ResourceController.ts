import { Request, Response } from 'express';
import _ from 'lodash';

import { ShoowDb } from '../services/tmdb';
import { TYPES as TMDB_TYPES } from '../services/tmdb/types';
import { defaultConfigs } from '../services/tmdb/constants';

import ResourceRepository from '../repositories/ResourceRepository';

import LogController from './LogController';

import SearchCache from '../schemas/SearchCache';
import TmdbCacheMovie from '../schemas/TmdbCacheMovie';
import TmdbCacheTv from '../schemas/TmdbCacheTv';
import TmdbCacheRecommendation from '../schemas/TmdbCacheRecommendation';
import TmdbCacheVideo from '../schemas/TmdbCacheVideo';
import TmdbCacheImage from '../schemas/TmdbCacheImage';

import {
  ERRORS_DEFAULT_3,
  ERRORS_SEARCH_10,
  ERRORS_SEARCH_11,
  RESOURCE_LOAD_DEFAULT_1,
} from '../langs/errors';

interface SearchResponseInterface {
  results: {
    type: string;
    page: number;
    total_results: number;
    total_pages: number;
    results: [];
  }[];
  total_results: number;
}

class ResourceController {
  async find(req: Request, res: Response): Promise<Response> {
    try {
      const { resourceId, type } = req.params;
      let { language } = req.query;

      if (!language) {
        language = defaultConfigs.language;
      }

      await ResourceRepository.defaultValidations(resourceId, type);

      let responseData;
      let consultInApi = false;
      let TMDBInterfaceConsult;

      if (TMDB_TYPES.movie === type) {
        TMDBInterfaceConsult = TmdbCacheMovie;
      }
      if (TMDB_TYPES.tv === type) {
        TMDBInterfaceConsult = TmdbCacheTv;
      }

      const findResource = await TMDBInterfaceConsult.findOne(
        { id: resourceId, typeResource: type, language },
        (err, data) => {
          if (!err) {
            if (!data) {
              consultInApi = true;
            }
          } else {
            consultInApi = true;
          }
        },
      );

      if (consultInApi) {
        await LogController.api(
          'Consulted api for the resource: SEARCH',
          'FIND',
        );

        await new ShoowDb(process.env.TMDB_API_KEY)
          .get(`${type}/${resourceId}?language=${language}`)
          .then((response) => {
            responseData = response;

            if (response) {
              responseData = {
                ...response,
                typeResource: type,
                language,
              };
            }
          });

        if (responseData) {
          await TMDBInterfaceConsult.create(responseData);
        }
      } else {
        responseData = findResource;
      }

      return res.json({
        error: false,
        status_code: RESOURCE_LOAD_DEFAULT_1.code,
        message: RESOURCE_LOAD_DEFAULT_1.message,
        payload: responseData,
      });
    } catch (e) {
      await LogController.exception(
        ERRORS_DEFAULT_3.http,
        ERRORS_DEFAULT_3.code,
        e.message,
        'FIND | CATCH ERROR',
      );

      await LogController.exception(
        ERRORS_DEFAULT_3.http,
        ERRORS_DEFAULT_3.code,
        ERRORS_DEFAULT_3.message,
        'FIND',
      );

      return res.status(ERRORS_DEFAULT_3.http).json({
        error: false,
        status_code: ERRORS_DEFAULT_3.code,
        message: ERRORS_DEFAULT_3.http,
      });
    }
  }

  async getRecommendations(req: Request, res: Response): Promise<Response> {
    try {
      const { resourceId, type } = req.params;
      let { language } = req.query;

      if (!language) {
        language = defaultConfigs.language;
      }

      await ResourceRepository.getRecommendationsValidations(resourceId, type);

      let responseData;
      let consultInApi = false;

      const findResource = await TmdbCacheRecommendation.findOne(
        { id: resourceId, typeResource: type, language },
        (err, data) => {
          if (!err) {
            if (!data) {
              consultInApi = true;
            }
          } else {
            consultInApi = true;
          }
        },
      );

      if (consultInApi) {
        await LogController.api(
          'Consulted api for the resource: SEARCH',
          'GET_RECOMMENDATIONS',
        );

        await new ShoowDb(process.env.TMDB_API_KEY)
          .get(`${type}/${resourceId}/recommendations?language=${language}`)
          .then((response) => {
            if (response) {
              responseData = {
                ...responseData,
                id: resourceId,
                typeResource: type,
                language,
                recommendations: response,
              };
            }
          });

        if (responseData) {
          await TmdbCacheRecommendation.create(responseData);
        }
      } else {
        responseData = findResource;
      }

      return res.json(responseData);
    } catch (e) {
      await LogController.exception(
        ERRORS_DEFAULT_3.http,
        ERRORS_DEFAULT_3.code,
        e.message,
        'GET_RECOMMENDATIONS | CATCH ERROR',
      );

      await LogController.exception(
        ERRORS_DEFAULT_3.http,
        ERRORS_DEFAULT_3.code,
        ERRORS_DEFAULT_3.message,
        'GET_RECOMMENDATIONS',
      );

      return res.status(ERRORS_DEFAULT_3.http).json({
        error: false,
        status_code: ERRORS_DEFAULT_3.code,
        message: ERRORS_DEFAULT_3.http,
      });
    }
  }

  async getVideos(req: Request, res: Response): Promise<Response> {
    try {
      const { resourceId, type } = req.params;
      let { language } = req.query;

      if (!language) {
        language = defaultConfigs.language;
      }

      await ResourceRepository.defaultValidations(resourceId, type);

      let responseData;
      let consultInApi = false;

      const findResource = await TmdbCacheVideo.findOne(
        { id: resourceId, typeResource: type, language },
        (err, data) => {
          if (!err) {
            if (!data) {
              consultInApi = true;
            }
          } else {
            consultInApi = true;
          }
        },
      );

      if (consultInApi) {
        await LogController.api(
          'Consulted api for the resource: SEARCH',
          'GET_VIDEOS',
        );

        await new ShoowDb(process.env.TMDB_API_KEY)
          .get(`${type}/${resourceId}/videos?language=${language}`)
          .then((response) => {
            if (response) {
              responseData = {
                ...responseData,
                id: resourceId,
                typeResource: type,
                language,
                videos: response,
              };
            }
          });

        if (responseData) {
          await TmdbCacheVideo.create(responseData);
        }
      } else {
        responseData = findResource;
      }

      return res.json(responseData);
    } catch (e) {
      await LogController.exception(
        ERRORS_DEFAULT_3.http,
        ERRORS_DEFAULT_3.code,
        e.message,
        'GET_VIDEOS | CATCH ERROR',
      );

      await LogController.exception(
        ERRORS_DEFAULT_3.http,
        ERRORS_DEFAULT_3.code,
        ERRORS_DEFAULT_3.message,
        'GET_VIDEOS',
      );

      return res.status(ERRORS_DEFAULT_3.http).json({
        error: false,
        status_code: ERRORS_DEFAULT_3.code,
        message: ERRORS_DEFAULT_3.http,
      });
    }
  }

  async getImages(req: Request, res: Response): Promise<Response> {
    try {
      const { resourceId, type } = req.params;
      let { language } = req.query;

      if (!language) {
        language = defaultConfigs.language;
      }

      await ResourceRepository.defaultValidations(resourceId, type);

      let responseData;
      let consultInApi = false;

      const findResource = await TmdbCacheImage.findOne(
        { id: resourceId, typeResource: type, language },
        (err, data) => {
          if (!err) {
            if (!data) {
              consultInApi = true;
            }
          } else {
            consultInApi = true;
          }
        },
      );

      if (consultInApi) {
        await LogController.api(
          'Consulted api for the resource: SEARCH',
          'GET_IMAGES',
        );

        await new ShoowDb(process.env.TMDB_API_KEY)
          .get(`${type}/${resourceId}/images?language=${language}`)
          .then((response) => {
            responseData = {
              ...responseData,
              id: resourceId,
              typeResource: type,
              language,
              images: response,
            };
          });

        if (responseData) {
          await TmdbCacheImage.create(responseData);
        }
      } else {
        responseData = findResource;
      }

      return res.json(responseData);
    } catch (e) {
      await LogController.exception(
        ERRORS_DEFAULT_3.http,
        ERRORS_DEFAULT_3.code,
        e.message,
        'GET_IMAGES | CATCH ERROR',
      );

      await LogController.exception(
        ERRORS_DEFAULT_3.http,
        ERRORS_DEFAULT_3.code,
        ERRORS_DEFAULT_3.message,
        'GET_IMAGES',
      );

      return res.status(ERRORS_DEFAULT_3.http).json({
        error: false,
        status_code: ERRORS_DEFAULT_3.code,
        message: ERRORS_DEFAULT_3.http,
      });
    }
  }

  async search(req: Request, res: Response): Promise<Response> {
    try {
      let { query } = req.params;
      let { language } = req.query;
      let consultApi = true;
      let responseData: SearchResponseInterface;

      if (!language) {
        language = defaultConfigs.language;
      }

      if (typeof query === 'undefined' || !query) {
        return res.status(ERRORS_SEARCH_11.http).json({
          error: true,
          status_code: ERRORS_SEARCH_11.code,
          message: ERRORS_SEARCH_11.message,
        });
      }

      query = decodeURIComponent(query);

      await SearchCache.findOne(
        {
          query,
          language,
        },
        (err, data) => {
          if (data) {
            responseData = data;
            consultApi = false;
          }
        },
      );

      if (consultApi) {
        await LogController.api(
          'Consulted api for the resource: SEARCH',
          'SEARCH',
        );

        const tmdb = new ShoowDb(process.env.TMDB_API_KEY);
        const arrayData = [];
        let length = 0;

        await tmdb
          .searchMovie({
            query,
            language,
          })
          .then((response) => {
            arrayData.push({
              type: 'movie',
              results: response.results,
            });

            length += response.results.length;
          });

        await tmdb
          .searchTv({
            query,
            language,
          })
          .then((response) => {
            arrayData.push({
              type: 'tv',
              results: response.results,
            });

            length += response.results.length;
          });

        if (!_.isEmpty(arrayData)) {
          SearchCache.create({
            query,
            language,
            results: arrayData,
            total_results: length,
          });

          responseData = {
            results: arrayData,
            total_results: length,
          };
        }
      }

      if (!_.isEmpty(responseData)) {
        return res.json({
          error: false,
          status_code: ERRORS_SEARCH_10.code,
          message: ERRORS_SEARCH_10.message,
          payload: responseData,
        });
      }

      return res.json({
        error: false,
        message: 'Data not found',
      });
    } catch (e) {
      await LogController.exception(
        ERRORS_DEFAULT_3.http,
        ERRORS_DEFAULT_3.code,
        e.message,
        'SEARCH | CATCH ERROR',
      );

      await LogController.exception(
        ERRORS_DEFAULT_3.http,
        ERRORS_DEFAULT_3.code,
        ERRORS_DEFAULT_3.message,
        'SEARCH',
      );

      return res.status(ERRORS_DEFAULT_3.http).json({
        error: false,
        status_code: ERRORS_DEFAULT_3.code,
        message: ERRORS_DEFAULT_3.message,
      });
    }
  }
}

export default new ResourceController();
