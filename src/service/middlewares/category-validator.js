'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);
const {getErrorListStr} = require(`../../utils`);

const CategoryLength = {
  Min: 5,
  Max: 30
};

const ErrorCategoryMessage = {
  CATEGORY_MIN: `Название категории должено содержать минимум ${CategoryLength.Min} символов`,
  CATEGORY_MAX: `Название категории должено содержать максимум ${CategoryLength.Max} символов!`,
  CATEGORY_REQUIRED: `Название категории обязательно для заполнения!`,
};

const schema = Joi.object({
  name: Joi.string().min(CategoryLength.Min).max(CategoryLength.Max).required().messages({
    'string.empty': ErrorCategoryMessage.CATEGORY_REQUIRED,
    'string.min': ErrorCategoryMessage.CATEGORY_MIN,
    'string.max': ErrorCategoryMessage.CATEGORY_MAX,
    'any.required': ErrorCategoryMessage.CATEGORY_REQUIRED
  }),
});

module.exports = (req, res, next) => {
  const {error} = schema.validate(req.body);
  if (error) {
    return res.status(HttpCode.BAD_REQUEST).send(getErrorListStr(error));
  }

  return next();
};
