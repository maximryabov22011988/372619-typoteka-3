'use strict';

const {HttpCode} = require(`../../constants`);

const REQUIRED_FIELDS = [`text`];

const commentValidator = (req, res, next) => {
  const comment = req.body;
  const fields = Object.keys(comment);
  const keysExists = REQUIRED_FIELDS.every((requiredField) => fields.includes(requiredField));

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};

module.exports = commentValidator;
