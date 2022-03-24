'use strict';

const Sequelize = require(`sequelize`);
const {DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD} = process.env;

const hasAllRequiredDbEnvVariables = [DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD].some((variable) => variable !== undefined);

if (!hasAllRequiredDbEnvVariables) {
  throw new Error(`One or more database environmental variables are not defined`);
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: `postgres`,
  pool: {
    min: 0,
    max: 10,
    acquire: 10000,
    idle: 10000
  }
});

module.exports = sequelize;
