'use strict';

const Sequelize = require(`sequelize`);
const {USER_ARGV_INDEX} = require(`../../constants`);

const {DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD} = process.env;
const userArgs = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArgs;

if (userCommand.includes(`server`)) {
  const hasAllRequiredDbEnvVariables = [DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD].some((variable) => variable !== undefined);

  if (!hasAllRequiredDbEnvVariables) {
    throw new Error(`One or more database environmental variables are not defined`);
  }

  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: `postgres`,
    pool: {
      min: 3,
      max: 7,
      acquire: 10000,
      idle: 10000
    }
  });

  module.exports = sequelize;
}

