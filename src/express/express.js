'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const path = require(`path`);
const {HttpCode} = require(`../constants`);
const mainRoutes = require(`./routes/main`);
const myRoutes = require(`./routes/my`);
const articlesRoutes = require(`./routes/articles`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const app = express();
app.use(express.urlencoded({extended: false}));

app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/`, mainRoutes);
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));
app.use((req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/404`));
app.use((err, req, res, _next) => res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT)
  .on(`listening`, () => {
    console.info(chalk.green(`Waiting for connections on port ${DEFAULT_PORT}`));
  })
  .on(`error`, (err) => {
    console.error(chalk.red(`Server creation error: ${err.message}`));
  });
