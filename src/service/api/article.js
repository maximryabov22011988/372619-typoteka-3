'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExists = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);

const articleAPI = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();
    res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;
    res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const newArticle = articleService.create(req.body);
    res.status(HttpCode.OK).json(newArticle);
  });

  route.put(`/:articleId`, [articleExists(articleService), articleValidator], (req, res) => {
    const {article: oldArticleData} = res.locals;
    const newArticleData = req.body;
    const updatedArticle = articleService.update(Object.assign(oldArticleData, newArticleData));
    res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = articleService.delete(articleId);
    if (!deletedArticle) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found article with id "${articleId}"`);
    }
    return res.status(HttpCode.OK).json(deletedArticle);
  });

  route.get(`/:articleId/comments`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;
    const comments = commentService.findAll(article);
    res.status(HttpCode.OK).json(comments);
  });

  route.post(`/:articleId/comments`, [articleExists(articleService), commentValidator], (req, res) => {
    const {article} = res.locals;
    const newComment = commentService.create(article, req.body);
    res.status(HttpCode.OK).json(newComment);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.delete(article, commentId);
    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found comment with id "${commentId}"`);
    }
    return res.status(HttpCode.OK).json(deletedComment);
  });
};

module.exports = articleAPI;
