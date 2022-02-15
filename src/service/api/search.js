'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const searchAPI = (app, service) => {
  const route = new Router();
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {query = ``} = req.query;
    if (!query) {
      return res.status(HttpCode.BAD_REQUEST).send([]);
    }

    const searchResults = service.findAll(query);
    const searchStatus = searchResults.length ? HttpCode.OK : HttpCode.NOT_FOUND;
    return res.status(searchStatus).json(searchResults);
  });
};

module.exports = searchAPI;
