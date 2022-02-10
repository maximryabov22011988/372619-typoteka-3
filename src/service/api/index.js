'use strict';

const {Router} = require(`express`);
const searchAPI = require(`./search`);
const categoryAPI = require(`./category`);
const articleAPI = require(`./article`);
const {
  SearchService,
  CategoryService,
  ArticleService,
  CommentService
} = require(`../data-service`);
const getMockData = require(`../lib/get-mock-data`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  searchAPI(app, new SearchService(mockData));
  categoryAPI(app, new CategoryService(mockData));
  articleAPI(app, new ArticleService(mockData), new CommentService());
})();

module.exports = app;
