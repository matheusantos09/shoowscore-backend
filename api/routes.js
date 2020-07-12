import {Router} from 'express';
import axios from 'axios';
// import addDays from 'date-fns/addDays';
import mongo from '../mongo.js';
// import TMDB from './services/tmdb/TMDB';
import mongoDB from './services/mongo/MongoDB';

const routes = new Router();

routes.get('/api', function (req, res) {
  res.send("What's up my nerdz?!?");
});

routes.get('/api/:tconst', async function (req, res) {
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

    // const tmdb = TMDB('aa1dfbdc71f68d0de4576cd1f8b6a8a9');
    let responseData,
      consultInApi = false;

    await mongoDB.find('tmdbcache', tconst).then((response) => {
      console.log('mongoDB.find', response);

      if (typeof response === 'undefined') {
        consultInApi = true;
      } else {
        // Caso não seja dado antigo
        // Caso seja
        // updateContent = true;
      }
    });

    /* if (consultInApi) {
      await tmdb.get(`movie/${tconst}`).then(response => {
        responseData = response;

        if (response) {

          response = {
            ...response,
            expires_at: addDays(new Date(), 1)
          }

          mongoDB.insertOne('tmdbcache', response);
        }

      });
    } */

    console.log('RESULT DEVOLVIDO', responseData);
  } catch (e) {
    console.log('ERROR TRY CATCH', e);
  }

  return res.send('Fim ');
});

routes.get('/api/poster/:tconst', function (req, res) {
  const url = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API}&i=${req.params.tconst}`;
  const placeholder = 'https://via.placeholder.com/300x450';

  axios.get(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const data = JSON.parse(body);
      const img = data.Poster;
      const result = img && img !== 'N/A' ? img : placeholder;

      res.send(result);
    } else {
      res.send(placeholder);
    }
  });
});

routes.get('/api/count/:type', function (req, res) {
  mongo((client) => {
    const db = client.db('tvratings');
    const col = db.collection(req.params.type);
    col.countDocuments().then((data) => res.send(`${data} records`));
  });
});

routes.get('/api/find/:type/:tconst', function (req, res) {
  mongo((client) => {
    const db = client.db('tvratings');
    const collection = db.collection(req.params.type);

    collection.findOne({tconst: req.params.tconst}).then(function (doc) {
      const result = !doc ? 'No record found.' : doc;
      client.close();
      res.send(result);
    });
  });
});

routes.get('/api/show/:tconst', function (req, res) {
  mongo((client) => {
    const db = client.db('tvratings');
    const basics = db.collection('basics');

    basics
      .aggregate([
        {$match: {tconst: req.params.tconst}},
        // get rating
        {
          $lookup: {
            from: 'ratings',
            localField: 'tconst',
            foreignField: 'tconst',
            as: 'rating',
          },
        },
        {$unwind: '$rating'},
        // get episodes for entire series
        {
          $lookup: {
            from: 'episode',
            localField: 'tconst',
            foreignField: 'parentTconst',
            as: 'episodes',
          },
        },
        {
          $project: {
            _id: 1,
            tconst: 1,
            primaryTitle: 1,
            startYear: 1,
            endYear: 1,
            averageRating: '$rating.averageRating',
            numVotes: '$rating.numVotes',
            episodeCount: {$size: '$episodes'},
          },
        },
      ])
      .toArray()
      .then((data) => {
        const results = data || 500;
        res.send(results);
        if (client) client.close();
      });
  });
});

routes.get('/api/search/:query', function (req, res) {
  mongo((client) => {
    const db = client.db('tvratings');
    const basics = db.collection('basics');
    const query = decodeURIComponent(req.params.query);

    basics
      .aggregate([
        {
          $match: {
            $and: [
              {titleType: 'tvSeries'},
              {
                $text: {
                  $search: query,
                },
              },
            ],
          },
        },
        {$sort: {score: {$meta: 'textScore'}}},
        // get episodes for entire series
        {
          $lookup: {
            from: 'episode',
            localField: 'tconst',
            foreignField: 'parentTconst',
            as: 'episodes',
          },
        },
        // get rating for entire series
        {
          $lookup: {
            from: 'ratings',
            localField: 'tconst',
            foreignField: 'tconst',
            as: 'rating',
          },
        },
        // { $sort: { "rating.numVotes": -1 } },
        // { $limit: 100 },
        {$unwind: '$rating'},
        {
          $project: {
            _id: 1,
            tconst: 1,
            primaryTitle: 1,
            startYear: 1,
            endYear: 1,
            genres: 1,
            averageRating: '$rating.averageRating',
            numVotes: '$rating.numVotes',
            episodeCount: {$size: '$episodes'},
          },
        },
        // only output shows that have episodes and over 500 votes
        {
          $match: {
            $and: [
              {episodeCount: {$gt: 0}},
              {numVotes: {$gt: 500}},
              {primaryTitle: new RegExp(`${query}.*`, 'i')},
            ],
          },
        },
      ])
      .toArray()
      .then((data) => {
        const results = data
          ? {
            response: data.length > 0,
            results: data,
          }
          : 500;
        // console.log(results);
        res.send(results);
        if (client) client.close();
      });
  });
});

routes.get('/api/seasons/:parentTconst', function (req, res) {
  mongo((client) => {
    const db = client.db('tvratings');
    const episode = db.collection('episode');

    episode
      .aggregate([
        {$match: {parentTconst: req.params.parentTconst}},
        // get rating
        {
          $lookup: {
            from: 'ratings',
            localField: 'tconst',
            foreignField: 'tconst',
            as: 'rating',
          },
        },
        {$unwind: '$rating'},
        // get title info
        {
          $lookup: {
            from: 'basics',
            localField: 'tconst',
            foreignField: 'tconst',
            as: 'title',
          },
        },
        {$unwind: '$title'},
        // format output
        {
          $project: {
            _id: 1,
            tconst: 1,
            parentTconst: 1,
            seasonNumber: 1,
            episodeNumber: 1,
            averageRating: '$rating.averageRating',
            numVotes: '$rating.numVotes',
            title: '$title.primaryTitle',
          },
        },
      ])
      .toArray()
      .then((data) => {
        const results = data || 500;
        res.send(results);
        if (client) client.close();
      });
  });
});

module.exports = routes;
