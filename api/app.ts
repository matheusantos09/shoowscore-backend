import express from 'express';
import routes from './routes';
import mongoose from 'mongoose'

class App {
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

  apiKeyVerify () {
    app.use(function ( req, res, next ) {
      const key = req.headers['x-api-key'];
      if (key && key === process.env.API_KEY) {
        return next();
      }
      res.send('Invalid API key supplied');
    });
  }

  database () {
    mongoose.connect('mongodb://127.0.0.1:27017/tvratings', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }
}

export default new App().server;
