'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);
const {getErrorListStr} = require(`../../utils`);

const TextLength = {
  Min: 30,
};

const ErrorCommentMessage = {
  TEXT_MIN_LENGTH: `Комментарий содержит меньше ${TextLength.Min} символов`,
  TEXT_EMPTY: `Комментарий не может быть пустым, напишите что-нибудь!`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const schema = Joi.object({
  text: Joi.string().min(TextLength.Min).required().messages({
    'string.min': ErrorCommentMessage.TEXT_MIN_LENGTH,
    'string.empty': ErrorCommentMessage.TEXT_EMPTY,
    'any.required': ErrorCommentMessage.TEXT_EMPTY
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorCommentMessage.USER_ID
  })
});

const validator = (req, res, next) => {
  const {error} = schema.validate(req.body, {abortEarly: false});
  if (error) {
    return res.status(HttpCode.BAD_REQUEST).send(getErrorListStr(error));
  }

  return next();
};

module.exports = validator;
