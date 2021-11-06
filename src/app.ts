// @ts-ignore
import express from 'express';
// @ts-ignore
import mongoose from 'mongoose';
// @ts-ignore
import dotenv from 'dotenv';
import cors from 'cors';

import routes from './routes';

class App {
  public server: any;

  constructor() {
    this.server = express();

    this.corsPermissions();
    // this.apiKeyVerify();
    this.middlewares();
    this.database();
    this.routes();
  }

  corsPermissions() {
    this.server.use(cors());
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  /* apiKeyVerify () {
    app.use(function ( req, res, next ) {
      const key = req.headers['x-api-key'];
      if (key && key === process.env.API_KEY) {
        return next();
      }
      res.send('Invalid API key supplied');
    });
  } */

  database() {
    // mongoose.connect(`mongodb://${ process.env.MONGO_DBHOST }:${ process.env.MONGO_DBPORT }/${ process.env.MONGO_DBNANE }`, {
    mongoose.connect(
      `mongodb://${dotenv.config().parsed.MONGO_DBHOST}:${
        dotenv.config().parsed.MONGO_DBPORT
      }/${dotenv.config().parsed.MONGO_DBNANE}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
  }
}

export default new App().server;
