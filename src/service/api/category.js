'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const categoryAPI = (app, service) => {
  const route = new Router();
  app.use(`/categories`, route);

  route.get(`/`, (req, res) => {
    const categories = service.findAll();
    res.status(HttpCode.OK).json(categories);
  });
};

module.exports = categoryAPI;

