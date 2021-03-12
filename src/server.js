require('dotenv').config();

const express = require('express');
const cors = require('cors');

class App {
  constructor () {
    this.express = express();
    this.express.use(cors());
    this.isDev = process.env.NODE_ENV !== 'production';

    this.middlewares();
    this.routes();
  }

  middlewares () {
    this.express.use(express.json());
  }

  routes () {
    this.express.use(require('./routes'));
  }
}

module.exports = new App().express;
