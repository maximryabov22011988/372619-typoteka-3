'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const userValidator = require(`../middlewares/user-validator`);
const passwordUtils = require(`../lib/password`);

module.exports = (app, userService) => {
  const route = new Router();
  app.use(`/user`, route);

  route.post(`/`, userValidator(userService), async (req, res) => {
    const userData = req.body;

    userData.passwordHash = await passwordUtils.hash(userData.password);
    const newUser = await userService.create(userData);
    delete newUser.passwordHash;

    res.status(HttpCode.CREATED).json(newUser);
  });
};
