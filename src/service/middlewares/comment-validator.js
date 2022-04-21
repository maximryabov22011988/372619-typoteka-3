'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);
const {getErrorListStr} = require(`../../utils`);

const TextLength = {
  Min: 30,
};

const ErrorCommentMessage = {
  TEXT: `Комментарий содержит меньше ${TextLength.Min} символов`
};

const schema = Joi.object({
  text: Joi.string().min(TextLength.Min).required().messages({
    'string.min': ErrorCommentMessage.TEXT
  }),
});

const validator = (req, res, next) => {
  const {error} = schema.validate(req.body, {abortEarly: false});
  if (error) {
    return res.status(HttpCode.BAD_REQUEST).send(getErrorListStr(error));
  }

  return next();
};

module.exports = validator;
