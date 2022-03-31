'use strict';

const axios = require(`axios`);

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }


  getArticles({offset, limit, withComments} = {}) {
    return this._load(`/articles`, {params: {offset, limit, withComments}});
  }

  getArticle(id, {withComments} = {}) {
    return this._load(`/articles/${id}`, {params: {withComments}});
  }

  async getAllComments() {
    const articles = await this._load(`/articles`, {params: {withComments: true}});
    return articles.reduce((result, article) => result.concat(article.comments), []);
  }

  getCategories({withCount} = {}) {
    return this._load(`/categories`, {params: {withCount}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  createArticle(data) {
    return this._load(`/articles`, {method: `POST`, data});
  }
}

const TIMEOUT = 1000;
const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
