'use strict';

const express = require(`express`);
const session = require(`express-session`);
const getSequelize = require(`../service/lib/sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);
const chalk = require(`chalk`);
const path = require(`path`);
const {HttpCode, DEFAULT_FRONT_PORT} = require(`../constants`);
const mainRoutes = require(`./routes/main`);
const myRoutes = require(`./routes/my`);
const articlesRoutes = require(`./routes/articles`);

const port = process.env.PORT || DEFAULT_FRONT_PORT;

const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const app = express();
const sequelize = getSequelize();
const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});
app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/`, mainRoutes);
app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));
app.use((req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/404`));
app.use((err, req, res, _next) => res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(port)
  .on(`listening`, () => {
    console.info(chalk.green(`Waiting for connections on port ${port}`));
  })
  .on(`error`, (err) => {
    console.error(chalk.red(`Server creation error: ${err.message}`));
  });
