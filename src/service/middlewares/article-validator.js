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
  Min: 30,
  Max: 1000
};

const ErrorOfferMessage = {
  TITLE_MIN: `Заголовок содержит меньше ${TitleLength.Min} символов`,
  TITLE_MAX: `Заголовок не может содержать более ${TitleLength.Max} символов`,
  TITLE_REQUIRED: `"Заголовок" - обязателен для заполнения`,
  ANNOUNCE_MIN: `Описание содержит меньше ${AnnounceLength.Min} символов`,
  ANNOUNCE_MAX: `Заголовок не может содержать более ${AnnounceLength.Max} символов`,
  ANNOUNCE_REQUIRED: `"Анонс" - обязателен для заполнения`,
  FULLTEXT_MIN: `Полный текст не может содержать менее ${FulltextLength.Min} символов`,
  FULLTEXT_MAX: `Полный текст не может содержать более ${FulltextLength.Max} символов`,
  CATEGORIES: `Не выбрана ни одна категория объявления`,
};

const schema = Joi.object({
  title: Joi.string().min(TitleLength.Min).max(TitleLength.Max).required().messages({
    'string.min': ErrorOfferMessage.TITLE_MIN,
    'string.max': ErrorOfferMessage.TITLE_MAX,
    'any.required': ErrorOfferMessage.TITLE_REQUIRED
  }),
  announce: Joi.string().min(AnnounceLength.Min).max(AnnounceLength.Max).required().messages({
    'string.min': ErrorOfferMessage.ANNOUNCE_MIN,
    'string.max': ErrorOfferMessage.ANNOUNCE_MAX,
    'any.required': ErrorOfferMessage.ANNOUNCE_REQUIRED
  }),
  fulltext: Joi.string().min(FulltextLength.Min).max(FulltextLength.Max).messages({
    'string.min': ErrorOfferMessage.FULLTEXT_MIN,
    'string.max': ErrorOfferMessage.FULLTEXT_MAX
  }),
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorOfferMessage.CATEGORIES
      })
  ).min(1).required(),
  picture: Joi.string(),
  createdDate: Joi.date().format(`YYYY-MM-DD`).required(),
});

const validator = (req, res, next) => {
  const {error} = schema.validate(req.body, {abortEarly: false});
  if (error) {
    return res.status(HttpCode.BAD_REQUEST).send(getErrorListStr(error));
  }

  return next();
};

module.exports = validator;
