'use strict';

const SearchService = require(`./search`);
const CategoryService = require(`./category`);
const ArticleService = require(`./article`);
const CommentService = require(`./comment`);
const UserService = require(`./user`);

module.exports = {
  SearchService,
  CategoryService,
  ArticleService,
  CommentService,
  UserService
};
