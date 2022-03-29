'use strict';

const {HttpCode} = require(`../../constants`);

const REQUIRED_FIELDS = [`title`, `announce`, `categories`, `fulltext`];

const articleValidator = (req, res, next) => {
  const article = req.body;
  const fields = Object.keys(article);
  const isRequiredFieldsExists = REQUIRED_FIELDS.every((requiredField) => fields.includes(requiredField));

  if (!isRequiredFieldsExists) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};

module.exports = articleValidator;

