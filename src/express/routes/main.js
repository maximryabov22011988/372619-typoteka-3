'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();

mainRouter.get(`/`, (req, res) => res.render(`main/index`));
mainRouter.get(`/login`, (req, res) => res.render(`main/login`));
mainRouter.get(`/register`, (req, res) => res.render(`main/sign-up`));
mainRouter.get(`/search`, (req, res) => res.render(`main/search/index`));
mainRouter.get(`/categories`, (req, res) => res.render(`main/all-categories`));

module.exports = mainRouter;
