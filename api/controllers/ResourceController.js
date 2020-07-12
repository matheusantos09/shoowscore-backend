import { addDays, isAfter } from 'date-fns';

import TMDB from '../services/tmdb/TMDB';
import TmdbCache from "../schemas/TmdbCache";

class ResourceController {
  async find (req, res) {
    try {
      const {tconst} = req.params;

      if (typeof tconst === 'undefined' || tconst === '') {
        // @TODO Melhorar o return das respostas de erro

        console.log('tconst', tconst);

        return res.send('No data found');
      }

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

      const tmdb = new TMDB('aa1dfbdc71f68d0de4576cd1f8b6a8a9');
      let responseData,
        updateContent = false,
        consultInApi = false;

      const findResource = await TmdbCache.findOne({tconst}, function (err, data) {

        if (!err) {

          if (data) {

            const isBeforeConst = isAfter(new Date(), data.expires_at)

            updateContent = isBeforeConst;
            consultInApi = isBeforeConst;

          } else {
            consultInApi = true;
          }

        } else {
          //@TODO Tratar erro

          updateContent = true;
        }

      });

      if (consultInApi) {
        await tmdb.get(`movie/${ tconst }`).then(response => {
          responseData = response;

          if (response) {

            response = {
              ...response,
              tconst: response.imdb_id,
              expires_at: addDays(new Date(), 1)
            }

            if (updateContent) {

              TmdbCache.updateOne({_id: findResource._id}, response, function (err, raw) {
                if (err) {
                  //@TODO Tratar error
                  console.log('TmdbCache.update', err)
                }
              })

            } else {

              TmdbCache.create(response, function (err, data) {
                if (!err) {
                  //@TODO TUDO OK
                } else {
                  //@TODO Tratar erro
                }

              });

            }

          }

        });
      } else {
        responseData = findResource
      }

      console.log('RESULT DEVOLVIDO', responseData);

      return res.json(responseData);
    } catch (e) {
      console.log('ERROR TRY CATCH', e);

      return res.json({
        error: true,
        message: 'Not load resource'
      })
    }
  }

}

export default new ResourceController()
