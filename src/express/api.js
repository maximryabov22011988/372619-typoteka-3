'use strict';

const axios = require(`axios`);
const {HttpMethod} = require(`../constants`);

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

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getArticles({offset, limit, withComments} = {}) {
    return this._load(`/articles`, {params: {offset, limit, withComments}});
  }

  getArticle(id, {withComments} = {}) {
    return this._load(`/articles/${id}`, {params: {withComments}});
  }

  getPopularArticles({withComments} = {}) {
    return this._load(`/articles/popular`, {params: {withComments}});
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  deleteArticle(id) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  async getAllComments() {
    const articles = await this._load(`/articles`, {params: {withComments: true}});
    return articles.reduce((result, article) => {
      article.comments = (article.comments || []).map((comment) => ({
        ...comment,
        articleTitle: article.title
      }));
      return result.concat(article.comments);
    }, []);
  }

  getLatestComments() {
    return this._load(`/articles/comments`);
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  deleteComment(articleId, commentId) {
    return this._load(`/articles/${articleId}/comments/${commentId}`, {
      method: HttpMethod.DELETE,
    });
  }

  getCategories({withCount} = {}) {
    return this._load(`/categories`, {params: {withCount}});
  }

  createCategory(data) {
    return this._load(`/categories/add`, {
      method: HttpMethod.POST,
      data,
    });
  }

  updateCategory(id, data) {
    return this._load(`/categories/${id}/update`, {
      method: HttpMethod.PUT,
      data,
    });
  }

  deleteCategory(id) {
    return this._load(`/categories/${id}/delete`, {
      method: HttpMethod.DELETE,
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
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
