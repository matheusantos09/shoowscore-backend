const express = require('express');
const routes = require('./routes');

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
      let key = req.headers['x-api-key'];
      if (key && key === process.env.API_KEY) {
        return next();
      } else {
        res.send("Invalid API key supplied");
      }
    });
  }
}

module.exports = new App().server;
