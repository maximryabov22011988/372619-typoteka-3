'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(searchedText) {
    return this._articles.filter((article) => article.title.toLowerCase().includes(searchedText.toLowerCase()));
  }
}

module.exports = SearchService;
