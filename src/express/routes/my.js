'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const isAdmin = require(`../middlewares/is-admin`);
const {HttpCode} = require(`../../constants`);

const Path = {
  My: `/`,
  Categories: `/categories`,
  CreateCategory: `/categories/add`,
  UpdateCategory: `/categories/:id/update`,
  DeleteCategory: `/categories/:id/delete`,
  Comments: `/comments`,
};

const PageTemplate = {
  My: `my/index`,
  Categories: `my/categories`,
  Comments: `my/comments`,
  InternalError: `errors/500`
};

const myRouter = new Router();

myRouter.get(Path.My, isAdmin, async (req, res) => {
  const {user} = req.session;
  try {
    const articles = await api.getArticles({withComments: true});
    res.render(PageTemplate.My, {articles, user});
  } catch (error) {
    res.status(HttpCode.BAD_REQUEST).render(PageTemplate.InternalError);
  }
});

myRouter.get(Path.Comments, isAdmin, async (req, res) => {
  const {user} = req.session;
  try {
    const comments = await api.getAllComments();
    res.render(PageTemplate.Comments, {comments, user});
  } catch (error) {
    res.status(HttpCode.BAD_REQUEST).render(PageTemplate.InternalError);
  }
});


myRouter.get(Path.Categories, isAdmin, async (req, res) => {
  const {user} = req.session;
  try {
    const categories = await api.getCategories();
    res.render(PageTemplate.Categories, {categories, user});
  } catch (error) {
    res.status(HttpCode.BAD_REQUEST).render(PageTemplate.InternalError);
  }
});

module.exports = myRouter;
