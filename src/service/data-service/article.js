'use strict';

const {generateId} = require(`../../utils`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  create(articleData) {
    const newArticle = Object.assign({
      id: generateId(),
      comments: []
    }, articleData);

    this._articles.push(newArticle);

    return newArticle;
  }

  update(newArticleData) {
    this._articles = this._articles.map((article) => article.id === newArticleData.id ? newArticleData : article);

    return newArticleData;
  }

  delete(articleId) {
    const currentArticleDataIndex = this._articles.findIndex((article) => article.id === articleId);
    const deletedArticle = this._articles.splice(currentArticleDataIndex, 1);

    return deletedArticle;
  }

  find(id) {
    return this._articles.find((article) => article.id === id);
  }

  findAll() {
    return this._articles;
  }
}

module.exports = ArticleService;
