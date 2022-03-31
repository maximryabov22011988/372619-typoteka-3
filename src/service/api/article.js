'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExists = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);

const articleAPI = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, withComments} = req.query;

    let result;
    if (offset || limit) {
      result = await articleService.findPage({offset, limit, withComments});
    } else {
      result = await articleService.findAll({withComments});
    }

    res.status(HttpCode.OK).json(result);
  });

  route.get(`/:articleId`, articleExists(articleService), async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.find(articleId, {withComments: true});
    res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const newArticle = await articleService.create(req.body);
    res.status(HttpCode.CREATED).json(newArticle);
  });

  route.put(`/:articleId`, [articleExists(articleService), articleValidator], async (req, res) => {
    const {articleId} = req.params;
    const newArticleData = req.body;
    const updatedArticle = await articleService.update(articleId, newArticleData);
    res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = await articleService.delete(articleId);
    if (!deletedArticle) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found article with id "${articleId}"`);
    }
    return res.status(HttpCode.OK).json(deletedArticle);
  });

  route.get(`/:articleId/comments`, articleExists(articleService), async (req, res) => {
    const {article} = res.locals;
    const comments = await commentService.findAll(article.id);
    res.status(HttpCode.OK).json(comments);
  });

  route.post(`/:articleId/comments`, [articleExists(articleService), commentValidator], async (req, res) => {
    const {article} = res.locals;
    const newComment = await commentService.create(article.id, req.body);
    res.status(HttpCode.CREATED).json(newComment);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExists(articleService), async (req, res) => {
    const {commentId} = req.params;
    const deletedComment = await commentService.delete(commentId);
    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found comment with id "${commentId}"`);
    }
    return res.status(HttpCode.OK).json(deletedComment);
  });
};

module.exports = articleAPI;
