import express from 'express';
import routes from './routes';

class App {
  constructor() {
    this.server = express();

    // this.apiKeyVerify();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  apiKeyVerify() {
    app.use(function (req, res, next) {
      const key = req.headers['x-api-key'];
      if (key && key === process.env.API_KEY) {
        return next();
      }
      res.send('Invalid API key supplied');
    });
  }
}

export default new App().server;
