import { Request, Response } from 'express'
import _ from 'lodash'

import { ShoowDb } from '../services/tmdb';
import { TYPES as TMDB_TYPES } from '../services/tmdb/types'

import ResourceRepository from "../repositories/ResourceRepository";

import SearchCache from "../schemas/SearchCache";
import TmdbCacheMovie from "../schemas/TmdbCacheMovie";
import TmdbCacheTv from "../schemas/TmdbCacheTv";
import TmdbCacheRecommendation from "../schemas/TmdbCacheRecommendation";
import TmdbCacheVideo from "../schemas/TmdbCacheVideo";
import TmdbCacheImage from "../schemas/TmdbCacheImage";

import { ERRORS_DEFAULT_3, ERRORS_SEARCH_10, ERRORS_SEARCH_11 } from "../langs/errors";

interface SearchResponseInterface {
  results: {
    type: string;
    page: number;
    total_results: number;
    total_pages: number;
    results: [];
  }[]
  total_results: number;
}

class ResourceController {

  async find ( req: Request, res: Response ): Promise<Response> {
    try {
      const { resourceId, type } = req.params;

      await ResourceRepository.defaultValidations(resourceId, type)

      let responseData,
        consultInApi = false,
        TMDBInterfaceConsult;

      if (TMDB_TYPES.movie === type) {
        TMDBInterfaceConsult = TmdbCacheMovie
      }
      if (TMDB_TYPES.tv === type) {
        TMDBInterfaceConsult = TmdbCacheTv
      }

      const findResource = await TMDBInterfaceConsult.findOne({ 'id': resourceId, 'typeResource': type }, function ( err, data ) {

        if (!err) {

          if (!data) {
            consultInApi = true;
          }

        } else {
          //@TODO Caso ocorra problema com o banco apenas será ignorado e será feito uma consulta na API

          consultInApi = true;
        }

      });

      if (consultInApi) {

        await ( new ShoowDb(process.env.TMDB_API_KEY) ).get(`${ type }/${ resourceId }`).then(response => {
          responseData = response;

          if (response) {

            responseData = {
              ...response,
              typeResource: type,
            }

          }

        });

        if (responseData) {
          await TMDBInterfaceConsult.create(responseData)
        }

      } else {
        responseData = findResource
      }

      return res.json(responseData);
    } catch (e) {
      return res
        .status(ERRORS_DEFAULT_3.http)
        .json({
          error: false,
          status_code: ERRORS_DEFAULT_3.code,
          message: ERRORS_DEFAULT_3.http
        });
    }
  }

  async getRecommendations ( req: Request, res: Response ): Promise<Response> {
    try {
      const { resourceId, type } = req.params;

      await ResourceRepository.getRecommendationsValidations(resourceId, type)

      let responseData,
        consultInApi = false;

      const findResource = await TmdbCacheRecommendation.findOne({ 'id': resourceId, 'typeResource': type }, function ( err, data ) {

        if (!err) {

          if (!data) {
            consultInApi = true;
          }

        } else {
          //@TODO Caso ocorra problema com o banco apenas será ignorado e será feito uma consulta na API

          consultInApi = true;
        }

      });

      if (consultInApi) {
        await ( new ShoowDb(process.env.TMDB_API_KEY) ).get(`${ type }/${ resourceId }/recommendations`).then(response => {
          if (response) {
            responseData = {
              ...responseData,
              'id': resourceId,
              'typeResource': type,
              'recommendations': response
            };
          }
        });

        if (responseData) {
          await TmdbCacheRecommendation.create(responseData)
        }

      } else {
        responseData = findResource
      }

      return res.json(responseData);
    } catch (e) {
      return res
        .status(ERRORS_DEFAULT_3.http)
        .json({
          error: false,
          status_code: ERRORS_DEFAULT_3.code,
          message: ERRORS_DEFAULT_3.http
        });
    }
  }

  async getVideos ( req: Request, res: Response ): Promise<Response> {
    try {
      const { resourceId, type } = req.params;

      await ResourceRepository.defaultValidations(resourceId, type)

      let responseData,
        consultInApi = false;

      const findResource = await TmdbCacheVideo.findOne({ 'id': resourceId, 'typeResource': type }, function ( err, data ) {

        if (!err) {

          if (!data) {
            consultInApi = true;
          }

        } else {
          //@TODO Caso ocorra problema com o banco apenas será ignorado e será feito uma consulta na API

          consultInApi = true;
        }

      });

      if (consultInApi) {

        await ( new ShoowDb(process.env.TMDB_API_KEY) ).get(`${ type }/${ resourceId }/videos`).then(response => {
          if (response) {
            responseData = {
              ...responseData,
              'id': resourceId,
              'typeResource': type,
              'videos': response
            };
          }
        });

        if (responseData) {
          await TmdbCacheVideo.create(responseData)
        }

      } else {
        responseData = findResource
      }

      return res.json(responseData);
    } catch (e) {
      return res
        .status(ERRORS_DEFAULT_3.http)
        .json({
          error: false,
          status_code: ERRORS_DEFAULT_3.code,
          message: ERRORS_DEFAULT_3.http
        });
    }
  }

  async getImages ( req: Request, res: Response ): Promise<Response> {
    try {
      const { resourceId, type } = req.params;

      await ResourceRepository.defaultValidations(resourceId, type)

      let responseData,
        consultInApi = false;

      const findResource = await TmdbCacheImage.findOne({ 'id': resourceId, 'typeResource': type }, function ( err, data ) {

        if (!err) {

          if (!data) {
            consultInApi = true;
          }

        } else {
          //@TODO Caso ocorra problema com o banco apenas será ignorado e será feito uma consulta na API

          consultInApi = true;
        }

      });

      if (consultInApi) {

        await ( new ShoowDb(process.env.TMDB_API_KEY) ).get(`${ type }/${ resourceId }/images`).then(response => {
          responseData = {
            ...responseData,
            'id': resourceId,
            'typeResource': type,
            'images': response
          };
        });

        if (responseData) {
          await TmdbCacheImage.create(responseData)
        }

      } else {
        responseData = findResource
      }

      return res.json(responseData);
    } catch (e) {
      return res
        .status(ERRORS_DEFAULT_3.http)
        .json({
          error: false,
          status_code: ERRORS_DEFAULT_3.code,
          message: ERRORS_DEFAULT_3.http
        });
    }
  }

  async search ( req: Request, res: Response ): Promise<Response> {
    try {
      let { query } = req.params,
        consultApi = true,
        responseData: SearchResponseInterface;

      if (typeof query === 'undefined' || !query) {
        return res.status(ERRORS_SEARCH_11.http)
          .json({
            error: true,
            status_code: ERRORS_SEARCH_11.code,
            message: ERRORS_SEARCH_11.message
          })
      }

      query = decodeURIComponent(query);

      await SearchCache.findOne({
        'query': query
      }, function ( err, data ) {
        if (data) {
          responseData = data
          consultApi = false
        }
      });

      if (consultApi) {

        const tmdb = new ShoowDb(process.env.TMDB_API_KEY);

        let length = 0;
        let arrayData = [];

        await tmdb.searchMovie({
          query
        }).then(response => {

          arrayData.push({
            type: 'movie',
            results: response.results
          })

          length += response.results.length
        });

        await tmdb.searchTv({
          query
        }).then(response => {
          // responseData = {
          //   ...responseData,
          //   'tv': response
          // };

          arrayData.push({
            type: 'tv',
            results: response.results
          })

          length += response.results.length
        });

        if (!_.isEmpty(arrayData)) {
          SearchCache.create({
            query,
            results: arrayData,
            total_results: length
          })

          responseData = {
            results: arrayData,
            total_results: length
          }
        }

      }

      if (!_.isEmpty(responseData)) {
        return res.json({
          error: false,
          status_code: ERRORS_SEARCH_10.code,
          message: ERRORS_SEARCH_10.message,
          payload: responseData
        })
      }

      return res
        .json({
          error: false,
          message: 'Data not found'
        });
    } catch (e) {
      return res
        .status(ERRORS_DEFAULT_3.http)
        .json({
          error: false,
          status_code: ERRORS_DEFAULT_3.code,
          message: ERRORS_DEFAULT_3.http
        });
    }
  }
}

export default new ResourceController()
