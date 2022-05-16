'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (categoryService) => async (req, res, next) => {
  const {name} = req.body;
  const category = await categoryService.findByName(name);

  if (category) {
    res.status(HttpCode.NOT_FOUND).send(`Категория ${name} уже существует`);
    return;
  }

  next();
};
