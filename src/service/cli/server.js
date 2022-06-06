'use strict';

const express = require(`express`);
const http = require(`http`);
const {
  API_PREFIX,
  HttpCode,
  ExitCode
} = require(`../../constants`);
const socket = require(`../lib/socket`);
const getSequelize = require(`../lib/sequelize`);
const getApi = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const DEFAULT_PORT = 3000;
const notFoundMessageText = `Not found`;

const logger = getLogger({name: `api`});
const app = express();
const server = http.createServer(app);

const io = socket(server);
app.locals.socketio = io;

app.use(express.json());

module.exports = {
  name: `--server`,
  async run(args) {
    const sequelize = getSequelize();

    app.use((req, res, next) => {
      logger.debug(`Request on route ${req.url}`);
      res.on(`finish`, () => {
        logger.info(`Response status code ${res.statusCode}`);
      });
      next();
    });

    app.use(API_PREFIX, getApi(sequelize));

    app.use((req, res) => {
      res.status(HttpCode.BAD_REQUEST).send(notFoundMessageText);
      logger.error(`Route not found: ${req.url}`);
    });
    app.use((err, _req, res, _next) => {
      const {message} = err;
      res.status(HttpCode.INTERNAL_SERVER_ERROR).send(message);
      logger.error(`An error occurred on processing request: ${message}`);
    });

    try {
      logger.info(`Trying to connect database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
    logger.info(`Connection to database established`);

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    server.listen(port)
      .on(`listening`, () => {
        logger.info(`Waiting for connections on port ${port}`);
      })
      .on(`error`, (err) => {
        logger.error(`Server creation error: ${err.message}`);
      });
  }
};
