'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const auth = require(`../middlewares/auth`);

const myRouter = new Router();

myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({withComments: true});
  res.render(`my/index`, {articles, user});
});

myRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const comments = await api.getAllComments();
  res.render(`my/comments`, {comments, user});
});

module.exports = myRouter;
