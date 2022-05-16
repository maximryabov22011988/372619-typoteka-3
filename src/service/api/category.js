'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const asyncHandler = require(`../middlewares/async-handler`);
const isCategoryExist = require(`../middlewares/category-exists`);
const categoryValidator = require(`../middlewares/category-validator`);
const checkCategoryCount = require(`../middlewares/check-category-count`);

const categoryAPI = (app, service) => {
  const route = new Router();
  app.use(`/categories`, route);

  route.get(`/`, asyncHandler(async (req, res) => {
    const {withCount} = req.query;
    const categories = await service.findAll({withCount});
    res.status(HttpCode.OK).json(categories);
  }));

  route.post(`/add`, [categoryValidator, isCategoryExist(service)], asyncHandler(async (req, res) => {
    const {name} = req.body;
    const category = await service.create(name);
    res.status(HttpCode.OK).json(category);
  }));

  route.put(`/:id/update`, [categoryValidator, isCategoryExist(service)], asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    const category = await service.update(id, name);
    res.status(HttpCode.OK).json(category);
  }));

  route.delete(`/:id/delete`, checkCategoryCount(service), asyncHandler(async (req, res) => {
    const {id} = req.params;
    const category = await service.delete(id);
    res.status(HttpCode.OK).json(category);
  }));
};

module.exports = categoryAPI;

