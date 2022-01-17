'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const {HttpCode} = require(`../../constants`);
const postsRoutes = require(`../routes/posts`);

const DEFAULT_PORT = 3000;
const notFoundMessageText = `Not found`;

const app = express();
app.use(express.json());
app.use(`/posts`, postsRoutes);
app.use((req, res) => res.status(HttpCode.BAD_REQUEST).send(notFoundMessageText));

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, (err) => {
      if (err) {
        return console.error(chalk.red(`Server creation error: ${err.message}`));
      }

      return console.info(chalk.green(`Waiting for connections on port ${port}`));
    });
  }
};
