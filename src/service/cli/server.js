'use strict';

const express = require(`express`);
const {
  API_PREFIX,
  HttpCode
} = require(`../../constants`);
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const DEFAULT_PORT = 3000;
const notFoundMessageText = `Not found`;

const app = express();
app.use(express.json());
const logger = getLogger({name: `api`});

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(HttpCode.BAD_REQUEST).send(notFoundMessageText);
  logger.error(`Route not found: ${req.url}`);
});
app.use((err, _req, _res, _next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port)
      .on(`listening`, () => {
        logger.info(`Waiting for connections on port ${port}`);
      })
      .on(`error`, (err) => {
        logger.error(`Server creation error: ${err.message}`);
      });
  }
};
