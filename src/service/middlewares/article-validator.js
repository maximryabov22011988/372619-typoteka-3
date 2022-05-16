'use strict';

const Joi = require(`joi`).extend(require(`@joi/date`));
const {HttpCode} = require(`../../constants`);
const {getErrorListStr} = require(`../../utils`);

const TitleLength = {
  Min: 30,
  Max: 250
};

const AnnounceLength = {
  Min: 30,
  Max: 250
};

const FulltextLength = {
  Max: 1000
};

const ErrorArticleMessage = {
  TITLE_MIN: `Заголовок содержит меньше ${TitleLength.Min} символов`,
  TITLE_MAX: `Заголовок не может содержать более ${TitleLength.Max} символов`,
  TITLE_REQUIRED: `"Заголовок" - обязателен для заполнения`,
  ANNOUNCE_MIN: `Анонс публикации содержит меньше ${AnnounceLength.Min} символов`,
  ANNOUNCE_MAX: `Анонс публикации не может содержать более ${AnnounceLength.Max} символов`,
  ANNOUNCE_REQUIRED: `"Анонс публикации" - обязателен для заполнения`,
  FULLTEXT_MAX: `Полный текст публикации не может содержать более ${FulltextLength.Max} символов`,
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const schema = Joi.object({
  title: Joi.string().min(TitleLength.Min).max(TitleLength.Max).required().messages({
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX,
    'any.required': ErrorArticleMessage.TITLE_REQUIRED,
    'string.empty': ErrorArticleMessage.TITLE_REQUIRED,
  }),
  announce: Joi.string().min(AnnounceLength.Min).max(AnnounceLength.Max).required().messages({
    'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
    'string.max': ErrorArticleMessage.ANNOUNCE_MAX,
    'any.required': ErrorArticleMessage.ANNOUNCE_REQUIRED,
    'string.empty': ErrorArticleMessage.ANNOUNCE_REQUIRED,
  }),
  fulltext: Joi.string().max(FulltextLength.Max).allow(null, ``).messages({
    'string.max': ErrorArticleMessage.FULLTEXT_MAX
  }),
  categories: Joi.array().items(
      Joi.number().integer().positive()
  ).min(1).required().messages({
    'array.min': ErrorArticleMessage.CATEGORIES
  }),
  picture: Joi.string().allow(null, ``),
  createdDate: Joi.date().required(),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorArticleMessage.USER_ID
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
