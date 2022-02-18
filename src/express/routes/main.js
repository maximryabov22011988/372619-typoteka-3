'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main/index`, {articles});
});

mainRouter.get(`/login`, (req, res) => res.render(`main/login`));
mainRouter.get(`/register`, (req, res) => res.render(`main/sign-up`));

mainRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;
  try {
    const results = await api.search(query);
    const resultsWithHighlightTitle = results.map((article) => {
      const index = article.title.toLowerCase().indexOf(query.toLowerCase());
      return {
        ...article,
        title: [
          {text: article.title.slice(0, index), type: `simple`},
          {text: article.title.slice(index, index + query.length), type: `bold`},
          {text: article.title.slice(index + query.length), type: `simple`},
        ]
      };
    });
    res.render(`main/search`, {results: resultsWithHighlightTitle, query});
  } catch (err) {
    res.render(`main/search`, {results: [], query});
  }
});

mainRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`main/all-categories`, {categories});
});

module.exports = mainRouter;
