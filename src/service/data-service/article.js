'use strict';

const Aliase = require(`../models/aliase`);
const getUserModelWithoutExcludedParams = require(`./get-user-model-without-excluded-params`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async update(id, newArticleData) {
    const {categories = [], ...articleData} = newArticleData;

    const [updatedArticleRows] = await this._Article.update(articleData, {
      where: {id},
    });

    if (categories.length) {
      const article = await this.find(id);
      await article.setCategories(categories);
    }

    return !!updatedArticleRows;
  }

  async delete(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async find(id, {withComments} = {}) {
    const include = [
      Aliase.CATEGORIES,
      getUserModelWithoutExcludedParams(this._User)
    ];

    if (withComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          getUserModelWithoutExcludedParams(this._User)
        ]
      });
    }

    return await this._Article.findByPk(id, {include});
  }

  async findAll({withComments} = {}) {
    const include = [
      Aliase.CATEGORIES,
      getUserModelWithoutExcludedParams(this._User)
    ];

    if (withComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          getUserModelWithoutExcludedParams(this._User)
        ]
      });
    }
    const articles = await this._Article.findAll({
      include,
    });

    return articles.map((article) => article.get());
  }

  async findPage({limit, offset, withComments} = {}) {
    const include = [
      Aliase.CATEGORIES,
      getUserModelWithoutExcludedParams(this._User)
    ];

    if (withComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          getUserModelWithoutExcludedParams(this._User)
        ]
      });
    }

    const {count, rows: articles} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });
    return {count, articles};
  }
}

module.exports = ArticleService;
