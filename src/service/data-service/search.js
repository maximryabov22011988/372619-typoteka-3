'use strict';

const {Op} = require(`sequelize`);
const Aliase = require(`../models/aliase`);
const getUserModelWithoutExcludedParams = require(`./get-user-model-without-excluded-params`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._User = sequelize.models.User;
  }

  async findAll(searchedText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchedText
        }
      },
      include: [
        Aliase.CATEGORIES,
        getUserModelWithoutExcludedParams(this._User)
      ],
      order: [
        [`createdDate`, `DESC`]
      ]
    });

    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
