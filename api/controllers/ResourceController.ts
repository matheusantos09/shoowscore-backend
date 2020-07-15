import { Request, Response } from 'express'
import _ from 'lodash'

import TMDB from '../services/tmdb/TMDB';
import TmdbCache from "../schemas/TmdbCache";
import SearchCache from "../schemas/SearchCache";
import ResourceRepository from "../repositories/ResourceRepository";

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
  async find ( req: Request, res: Response ): Promise<Response> {
    try {
      const { resourceId, type } = req.params;

      await ResourceRepository.findValidations(resourceId, type)

      /*
      Etapas:
      - Verificar no banco se ja tem o cache do TMDB
        -- Se tiver ele traz o cache do DB
          --- Verificar se ele não é antigo (1h)
            ---- Caso o cache antigo será consultado na API e será atualizado e retornar esses valores
            ---- Caso não ser antigo ele será apenas retornado
        -- Se não tiver consultar na API
          -- Salvar o cache no banco de dados e retornar os dados
       */

      const tmdb = new TMDB(process.env.TMDB_API_KEY);
      let responseData,
        consultInApi = false;

      const findResource = await TmdbCache.findOne({ 'id': resourceId, 'typeResource': type }, function ( err, data ) {

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
        await tmdb.get(`${ type }/${ resourceId }`).then(response => {
          responseData = response;

          if (response) {

            responseData = {
              ...response,
              typeResource: type,
            }

          }

        });
        await tmdb.get(`${ type }/${ resourceId }/images`).then(response => {
          responseData = {
            ...responseData,
            'images': response
          };
        });
        await tmdb.get(`${ type }/${ resourceId }/videos`).then(response => {
          if (response.results) {
            responseData = {
              ...responseData,
              'videos': response.results
            };
          }
        });
        await tmdb.get(`${ type }/${ resourceId }/recommendations`).then(response => {
          if (response.results) {
            responseData = {
              ...responseData,
              'recommendations': response.results
            };
          }
        });

        if (responseData) {
          await TmdbCache.create(responseData, function ( err, data ) {
            if (!err) {
              //@TODO TUDO OK
            } else {
              //@TODO Tratar erro
            }

          });
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
