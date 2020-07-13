import express from 'express';
import mongoose from 'mongoose'

import routes from './routes';

class App {
  public server: any;

  constructor () {
    this.server = express();

    // this.apiKeyVerify();
    this.middlewares();
    this.database();
    this.routes();
  }

  middlewares () {
    this.server.use(express.json());
  }

  routes () {
    this.server.use(routes);
  }

  /*apiKeyVerify () {
    app.use(function ( req, res, next ) {
      const key = req.headers['x-api-key'];
      if (key && key === process.env.API_KEY) {
        return next();
      }
      res.send('Invalid API key supplied');
    });
  }*/

  database () {
    mongoose.connect(`mongodb://${ process.env.MONGO_DBHOST }:${ process.env.MONGO_DBPORT }/${ process.env.MONGO_DBNANE }`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }
}

export default new App().server;
