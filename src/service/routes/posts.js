'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const {MOCK_FILENAME} = require(`../../constants`);

const postsRouter = new Router();
postsRouter.get(`/`, async (req, res) => {
  try {
    const content = await fs.readFile(MOCK_FILENAME, `utf-8`);
    const articles = JSON.parse(content);
    res.json(articles);
  } catch (err) {
    res.json([]);
  }
});

module.exports = postsRouter;
