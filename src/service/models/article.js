/* eslint-disable new-cap */
'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  title: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  announce: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  fulltext: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  picture: DataTypes.STRING,
}, {
  sequelize,
  tableName: `articles`
});

module.exports = define;

