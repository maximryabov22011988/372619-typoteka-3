'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles({withComments: true});
  res.render(`my/index`, {articles});
});

myRouter.get(`/comments`, async (req, res) => {
  const comments = await api.getAllComments();
  res.render(`my/comments`, {comments});
});

module.exports = myRouter;
