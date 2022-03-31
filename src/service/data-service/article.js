'use strict';

const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
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
    const include = [Aliase.CATEGORIES];

    if (withComments) {
      include.push(Aliase.COMMENTS);
    }
    return await this._Article.findByPk(id, {include});
  }

  async findAll({withComments} = {}) {
    const include = [Aliase.CATEGORIES];

    if (withComments) {
      include.push(Aliase.COMMENTS);
    }
    const articles = await this._Article.findAll({
      include,
    });

    return articles.map((article) => article.get());
  }
}

module.exports = ArticleService;
