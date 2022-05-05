'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const asyncHandler = require(`../middlewares/async-handler`);

const categoryAPI = (app, service) => {
  const route = new Router();
  app.use(`/categories`, route);

  route.get(`/`, asyncHandler(async (req, res) => {
    const {withCount} = req.query;
    const categories = await service.findAll({withCount});
    res.status(HttpCode.OK).json(categories);
  }));
};

module.exports = categoryAPI;

