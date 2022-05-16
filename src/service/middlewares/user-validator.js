'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);
const asyncHandler = require(`../../middlewares/async-handler`);
const {getErrorListStr} = require(`../../utils`);

const ErrorRegisterMessage = {
  FIRSTNAME: `Имя содержит некорректные символы`,
  FIRSTNAME_REQUIRED: `Укажите ваше имя`,
  LASTNAME: `Фамилия содержит некорректные символы`,
  LASTNAME_REQUIRED: `Укажите вашу фамилию`,
  EMAIL_INVALID: `Некорректный электронный адрес`,
  EMAIL_REQUIRED: `Укажите email`,
  EMAIL_EXIST: `Электронный адрес уже используется`,
  PASSWORD_MIN_LENGTH: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REQUIRED: `Укажите пароль`,
  PASSWORD_REPEATED: `Пароли не совпадают`,
};

const NAME_PATTERN = /^[A-Za-zА-Яа-я\s]+$/;

const schema = Joi.object({
  firstName: Joi.string().pattern(NAME_PATTERN).required().messages({
    'string.pattern.base': ErrorRegisterMessage.FIRSTNAME,
    'string.empty': ErrorRegisterMessage.FIRSTNAME_REQUIRED,
    'any.required': ErrorRegisterMessage.FIRSTNAME_REQUIRED,
  }),
  lastName: Joi.string().pattern(NAME_PATTERN).required().messages({
    'string.pattern.base': ErrorRegisterMessage.LASTNAME,
    'string.empty': ErrorRegisterMessage.LASTNAME_REQUIRED,
    'any.required': ErrorRegisterMessage.LASTNAME_REQUIRED,
  }),
  email: Joi.string().email().required().messages({
    'string.email': ErrorRegisterMessage.EMAIL_INVALID,
    'string.empty': ErrorRegisterMessage.EMAIL_REQUIRED,
    'any.required': ErrorRegisterMessage.EMAIL_REQUIRED,
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': ErrorRegisterMessage.PASSWORD_MIN_LENGTH,
    'string.empty': ErrorRegisterMessage.PASSWORD_REQUIRED,
    'any.required': ErrorRegisterMessage.PASSWORD_REQUIRED,
  }),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)).required().messages({
    'string.min': ErrorRegisterMessage.PASSWORD_MIN_LENGTH,
    'string.empty': ErrorRegisterMessage.PASSWORD_REQUIRED,
    'any.only': ErrorRegisterMessage.PASSWORD_REPEATED
  }),
  avatar: Joi.string().allow(null, ``)
});

const validator = (userService) => asyncHandler(async (req, res, next) => {
  const userData = req.body;

  const {error} = schema.validate(userData, {abortEarly: false});
  if (error) {
    return res.status(HttpCode.BAD_REQUEST).send(getErrorListStr(error));
  }

  const userByEmail = await userService.findByEmail(userData.email);
  if (userByEmail) {
    return res.status(HttpCode.BAD_REQUEST).send(ErrorRegisterMessage.EMAIL_EXIST);
  }

  return next();
});

module.exports = validator;
