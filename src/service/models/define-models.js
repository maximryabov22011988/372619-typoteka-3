'use strict';

const {Model} = require(`sequelize`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);
const Aliase = require(`./aliase`);

const defineModels = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);

  Article.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `articleId`,
    onDelete: `cascade`
  });
  Comment.belongsTo(Article, {
    foreignKey: `articleId`
  });

  class ArticleCategory extends Model {}
  ArticleCategory.init({}, {sequelize});
  Article.belongsToMany(Category, {
    through: ArticleCategory,
    as: Aliase.CATEGORIES,
  });
  Category.belongsToMany(Article, {
    through: ArticleCategory,
    as: Aliase.ARTICLES,
  });
  Category.hasMany(ArticleCategory, {as: Aliase.ARTICLES_CATEGORIES});

  User.hasMany(Article, {
    as: Aliase.ARTICLES,
    foreignKey: `userId`,
  });
  Article.belongsTo(User, {
    as: Aliase.USERS,
    foreignKey: `userId`
  });

  User.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `userId`,
  });
  Comment.belongsTo(User, {
    as: Aliase.USERS,
    foreignKey: `userId`
  });

  return {Category, Comment, Article, ArticleCategory, User};
};

module.exports = defineModels;
