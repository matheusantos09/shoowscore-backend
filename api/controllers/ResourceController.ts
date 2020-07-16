import { Request, Response } from 'express'
import _ from 'lodash'

import TMDB from '../services/tmdb/TMDB';
import { TYPES as TMDB_TYPES } from '../services/tmdb/types'
import TmdbCacheMovie from "../schemas/TmdbCacheMovie";
import TmdbCacheTv from "../schemas/TmdbCacheTv";
import SearchCache from "../schemas/SearchCache";
import ResourceRepository from "../repositories/ResourceRepository";
import TmdbCacheRecommendation from "../schemas/TmdbCacheRecommendation";

interface SearchResponseInterface {
  tv?: {
    page: number;
    total_results: number;
    total_pages: number;
    results: [];
  },
  movie?: {
    page: number;
    total_results: number;
    total_pages: number;
    results: [];
  }
}

class ResourceController {
  private tmdbClass: TMDB;

  constructor () {
    this.tmdbClass = new TMDB(process.env.TMDB_API_KEY);
  }

  async find ( req: Request, res: Response ): Promise<Response> {
    try {
      const { resourceId, type } = req.params;

      await ResourceRepository.findValidations(resourceId, type)

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
          //@TODO Tratar erro

          consultInApi = true;
        }

      });

      if (consultInApi) {
        await this.tmdbClass.get(`${ type }/${ resourceId }`).then(response => {
          responseData = response;

          if (response) {

            responseData = {
              ...response,
              typeResource: type,
            }

          }

        });
        await this.tmdbClass.get(`${ type }/${ resourceId }/images`).then(response => {
          responseData = {
            ...responseData,
            'images': response
          };
        });
        await this.tmdbClass.get(`${ type }/${ resourceId }/videos`).then(response => {
          if (response.results) {
            responseData = {
              ...responseData,
              'videos': response.results
            };
          }
        });
        await this.tmdbClass.get(`${ type }/${ resourceId }/recommendations`).then(response => {
          if (response.results) {
            responseData = {
              ...responseData,
              'recommendations': response.results
            };
          }
        });

        if (responseData) {
          await TMDBInterfaceConsult.create(responseData)
        }

      } else {
        responseData = findResource
      }

      // console.log('RESULT DEVOLVIDO', responseData);

      return res.json(responseData);
    } catch (e) {
      console.log('ERROR TRY CATCH', e);

      return res.json({
        error: true,
        message: 'Not load resource'
      })
    }
  }

  async findRecommendations ( req: Request, res: Response ): Promise<Response> {
    try {
      const { resourceId, type } = req.params;

      await ResourceRepository.findRecommendationsValidations(resourceId, type)

      let responseData,
        consultInApi = false;

      const findResource = await TmdbCacheRecommendation.findOne({ 'id': resourceId, 'typeResource': type }, function ( err, data ) {

        if (!err) {

          if (!data) {
            consultInApi = true;
          }

        } else {
          //@TODO Tratar erro

          consultInApi = true;
        }

      });

      if (consultInApi) {
        await this.tmdbClass.get(`${ type }/${ resourceId }/recommendations`).then(response => {
          if (response.results) {
            responseData = {
              ...responseData,
              'recommendations': response.results
            };
          }
        });

        if (responseData) {
          await TmdbCacheRecommendation.create(responseData)
        }

      } else {
        responseData = findResource
      }

      // console.log('RESULT DEVOLVIDO', responseData);

      return res.json(responseData);
    } catch (e) {
      console.log('ERROR TRY CATCH', e);

      return res.json({
        error: true,
        message: 'Not load resource'
      })
    }
  }

  async search ( req: Request, res: Response ): Promise<Response> {

    let { query } = req.params,
      consultApi = true,
      responseData: SearchResponseInterface = {};

    if (typeof query === 'undefined' || !query) {
      return res.status(400)
        .json({
          error: true,
          message: 'Parameter search not found'
        })
    }

    query = decodeURIComponent(query);

    await SearchCache.findOne({
      'query': query
    }, function ( err, data ) {

      if (data) {
        responseData = data.payload
        consultApi = false
      }

    });

    if (consultApi) {

      const tmdb = new TMDB(process.env.TMDB_API_KEY);

      await tmdb.get(`search/movie`, {
        query
      }).then(response => {
        responseData = {
          ...responseData,
          'movie': response
        };
      });
      await tmdb.get('search/tv', {
        query
      }).then(response => {
        responseData = {
          ...responseData,
          'tv': response
        };
      });

      if (!_.isEmpty(responseData)) {
        SearchCache.create({
          query,
          payload: responseData
        })
      }

    }

    if (!_.isEmpty(responseData)) {
      return res.json({
        error: false,
        message: 'Search results',
        payload: responseData
      })
    }

    return res
      .status(404)
      .json({
        error: false,
        message: 'data not found'
      });
  }
}

export default new ResourceController()
