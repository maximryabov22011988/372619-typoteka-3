'use strict';

const express = require(`express`);
const {HttpCode} = require(`../constants`);
const mainRoutes = require(`./routes/main`);
const myRoutes = require(`./routes/my`);
const articlesRoutes = require(`./routes/articles`);

const DEFAULT_PORT = 8080;

const app = express();

app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/`, mainRoutes);
app.use((req, res) => res.status(HttpCode.BAD_REQUEST).send(`Not found`));
app.use((err, req, res, _next) => res.status(HttpCode.INTERNAL_SERVER_ERROR).send(`Internal server error`));

app.listen(DEFAULT_PORT);
