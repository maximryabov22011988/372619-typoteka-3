'use strict';

const {Router} = require(`express`);
const searchAPI = require(`./search`);
const categoryAPI = require(`./category`);
const articleAPI = require(`./article`);
const userAPI = require(`./user`);
const {
  SearchService,
  CategoryService,
  ArticleService,
  CommentService,
  UserService,
} = require(`../data-service`);
const defineModels = require(`../models`);

const getApi = (sequelize) => {
  const app = new Router();

  defineModels(sequelize);

  searchAPI(app, new SearchService(sequelize));
  categoryAPI(app, new CategoryService(sequelize));
  articleAPI(app, new ArticleService(sequelize), new CommentService(sequelize));
  userAPI(app, new UserService(sequelize));

  return app;
};

module.exports = getApi;

