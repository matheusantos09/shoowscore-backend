const {Router} = require('express');

const mongo = require('../mongo.js');
const axios = require('axios');
const TMDB = require('./services/tmdb/TMDB')


const routes = new Router();

routes.get('/api', function (req, res) {
  res.send("What's up my nerdz?!?")
})

routes.get('/api/:tconst', function (req, res) {

  const {tconst} = req.params;

  if (typeof tconst === 'undefined' || tconst === '') {
    //@TODO Melhorar o return das respostas de erro

    console.log('tconst', tconst)

    return res.send('No data found')
  }

  const tmdb = new TMDB('aa1dfbdc71f68d0de4576cd1f8b6a8a9');

  tmdb.get(`movie/${tconst}`).then(response => {
    // console.log(response)
  });

  return res.send('Fim ')
});

routes.get('/api/poster/:tconst', function (req, res) {
  var url = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API}&i=${req.params.tconst}`,
    placeholder = 'https://via.placeholder.com/300x450';

  axios.get(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      let data = JSON.parse(body),
        img = data.Poster,
        result = (img && img !== "N/A") ? img : placeholder;

      res.send(result)
    } else {
      res.send(placeholder)
    }
  });
})

routes.get('/api/count/:type', function (req, res) {
  mongo(client => {
    const db = client.db('tvratings');
    const col = db.collection(req.params.type);
    col.countDocuments().then(data => res.send(`${data} records`))
  });
})

routes.get('/api/find/:type/:tconst', function (req, res) {
  mongo(client => {
    const db = client.db('tvratings');
    const collection = db.collection(req.params.type);

    collection.findOne({'tconst': req.params.tconst})
      .then(function (doc) {
        var result = (!doc) ? 'No record found.' : doc;
        client.close();
        res.send(result)
      });
  })
})

routes.get('/api/show/:tconst', function (req, res) {
  mongo(client => {
    const db = client.db('tvratings');
    const basics = db.collection('basics');

    basics.aggregate([
      {$match: {'tconst': req.params.tconst}},
      //get rating
      {
        $lookup: {
          from: 'ratings',
          localField: 'tconst',
          foreignField: 'tconst',
          as: 'rating'
        }
      },
      {$unwind: "$rating"},
      //get episodes for entire series
      {
        $lookup: {
          from: 'episode',
          localField: 'tconst',
          foreignField: 'parentTconst',
          as: 'episodes'
        }
      },
      {
        $project: {
          _id: 1,
          tconst: 1,
          primaryTitle: 1,
          startYear: 1,
          endYear: 1,
          averageRating: "$rating.averageRating",
          numVotes: "$rating.numVotes",
          episodeCount: {$size: "$episodes"}
        }
      }
    ]).toArray().then(data => {
      var results = (data) ? data : 500;
      res.send(results);
      if (client) client.close();
    });
  });
})

routes.get('/api/search/:query', function (req, res) {
  mongo(client => {
    const db = client.db('tvratings');
    const basics = db.collection('basics');
    var query = decodeURIComponent(req.params.query);

    basics.aggregate([
      {
        $match:
          {
            $and: [
              {'titleType': 'tvSeries'},
              {
                $text: {
                  $search: query
                }
              }
            ]
          }
      },
      {$sort: {score: {$meta: "textScore"}}},
      //get episodes for entire series
      {
        $lookup: {
          from: 'episode',
          localField: 'tconst',
          foreignField: 'parentTconst',
          as: 'episodes'
        }
      },
      //get rating for entire series
      {
        $lookup: {
          from: 'ratings',
          localField: 'tconst',
          foreignField: 'tconst',
          as: 'rating'
        }
      },
      //{ $sort: { "rating.numVotes": -1 } },
      //{ $limit: 100 },
      {$unwind: "$rating"},
      {
        $project: {
          _id: 1,
          tconst: 1,
          primaryTitle: 1,
          startYear: 1,
          endYear: 1,
          genres: 1,
          averageRating: "$rating.averageRating",
          numVotes: "$rating.numVotes",
          episodeCount: {$size: "$episodes"}
        }
      },
      //only output shows that have episodes and over 500 votes
      {
        $match: {
          $and: [
            {"episodeCount": {$gt: 0}},
            {"numVotes": {$gt: 500}},
            {"primaryTitle": new RegExp(query + '.*', 'i')}
          ]
        }
      },
    ])
      .toArray().then(data => {
      let results = (data) ? {
        response: (data.length > 0) ? true : false,
        results: data
      } : 500;
      //console.log(results);
      res.send(results);
      if (client) client.close();
    });
  });
})

routes.get('/api/seasons/:parentTconst', function (req, res) {
  mongo(client => {
    const db = client.db('tvratings');
    const episode = db.collection('episode');

    episode.aggregate([
      {$match: {'parentTconst': req.params.parentTconst}},
      //get rating
      {
        $lookup: {
          from: 'ratings',
          localField: 'tconst',
          foreignField: 'tconst',
          as: 'rating'
        }
      },
      {$unwind: "$rating"},
      //get title info
      {
        $lookup: {
          from: 'basics',
          localField: 'tconst',
          foreignField: 'tconst',
          as: 'title'
        }
      },
      {$unwind: "$title"},
      //format output
      {
        $project: {
          _id: 1,
          tconst: 1,
          parentTconst: 1,
          seasonNumber: 1,
          episodeNumber: 1,
          averageRating: "$rating.averageRating",
          numVotes: "$rating.numVotes",
          title: "$title.primaryTitle"
        }
      }
    ]).toArray().then(data => {
      var results = (data) ? data : 500;
      res.send(results);
      if (client) client.close();
    });
  });
});

module.exports = routes;
