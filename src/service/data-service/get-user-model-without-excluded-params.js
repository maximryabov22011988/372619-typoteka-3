'use strict';

const Aliase = require(`../models/aliase`);

const getUserModelWithoutExcludedParams = (userModel, exclude = []) => ({
  model: userModel,
  as: Aliase.USERS,
  attributes: {
    exclude: [`passwordHash`, ...exclude]
  }
});

module.exports = getUserModelWithoutExcludedParams;
