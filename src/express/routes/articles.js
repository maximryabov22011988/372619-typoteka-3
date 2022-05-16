'use strict';

const {Router} = require(`express`);
const auth = require(`../middlewares/auth`);
const isAdmin = require(`../middlewares/is-admin`);
const upload = require(`../middlewares/upload`);
const api = require(`../api`).getAPI();
const {ARTICLES_PER_PAGE} = require(`./constants`);
const {HttpCode} = require(`../../constants`);
const {ensureArray, prepareErrors} = require(`../../utils`);

const Path = {
  CreateArticle: `/add`,
  EditArticle: `/edit/:id`,
  DeleteArticle: `/:id`,
  ViewArticle: `/:id`,
  MyArticles: `/my`,
  MyComments: `/my/comments`,
  ArticleComments: `/:id/comments`,
  DeleteComment: `/:id/comments/:commentId`,
  ArticlesByCategory: `/category/:id`,
};

const PageTemplate = {
  CreateArticle: `articles/article-create`,
  EditArticle: `articles/article-edit`,
  ViewArticle: `articles/article-view`,
  ArticlesByCategory: `articles/articles-by-category`,
  InternalError: `errors/500`
};

const articlesRouter = new Router();

const getCategories = (params) => api.getCategories(params);

const getArticleData = async ({id, withComments = false, withCount = false}) => {
  const [article, categories] = await Promise.all([api.getArticle(id, {withComments}), getCategories({withCount})]);
  return {article, categories};
};

articlesRouter.get(Path.CreateArticle, isAdmin, async (req, res) => {
  const {user} = req.session;

  try {
    const categories = await getCategories();
    res.render(PageTemplate.CreateArticle, {categories, user});
  } catch (error) {
    res.status(HttpCode.BAD_REQUEST).render(PageTemplate.InternalError);
  }
});

articlesRouter.post(Path.CreateArticle, [isAdmin, upload.single(`upload`)], async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;

  const newArticle = {
    title: body.title,
    picture: file ? file.filename : ``,
    categories: (body.categories || []).map(Number),
    announce: body.announce,
    fulltext: body.fulltext,
    createdDate: body.date,
    userId: user.id
  };

  try {
    await api.createArticle(newArticle);
    res.redirect(Path.MyArticles);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getCategories();
    res.render(PageTemplate.CreateArticle, {validationMessages, categories, user});
  }
});

articlesRouter.get(Path.EditArticle, isAdmin, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  try {
    const articleData = await getArticleData({id});
    res.render(PageTemplate.EditArticle, {id, ...articleData, user});
  } catch (error) {
    res.status(HttpCode.BAD_REQUEST).render(PageTemplate.InternalError);
  }
});

articlesRouter.post(Path.EditArticle, [isAdmin, upload.single(`upload`)], async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {body, file} = req;

  const updatedArticle = {
    title: body.title,
    picture: file ? file.filename : body[`old-image`],
    categories: ensureArray((body.categories || []).map(Number)),
    announce: body.announce,
    fulltext: body.fulltext,
    createdDate: body.date,
    userId: user.id
  };

  try {
    await api.editArticle(id, updatedArticle);
    res.redirect(Path.MyArticles);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const articleData = await getArticleData({id});
    res.render(PageTemplate.EditArticle, {id, ...articleData, user, validationMessages});
  }
});

articlesRouter.post(Path.DeleteArticle, isAdmin, async (req, res) => {
  const {id} = req.params;

  try {
    await api.deleteArticle(id);
    res.redirect(Path.MyArticles);
  } catch (error) {
    res.status(HttpCode.BAD_REQUEST).render(PageTemplate.InternalError);
  }
});

articlesRouter.get(Path.ViewArticle, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  try {
    const articleData = await getArticleData({id, withComments: true, withCount: true});
    res.render(PageTemplate.ViewArticle, {id, ...articleData, user});
  } catch (error) {
    res.status(HttpCode.BAD_REQUEST).render(PageTemplate.InternalError);
  }
});

articlesRouter.post(Path.ArticleComments, auth, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {text: comment, userId: user.id});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const articleData = await getArticleData({id, withComments: true, withCount: true});
    res.render(PageTemplate.ViewArticle, {validationMessages, id, ...articleData, user});
  }
});

articlesRouter.post(Path.DeleteComment, isAdmin, async (req, res) => {
  const {id, commentId} = req.params;
  try {
    await api.deleteComment(id, commentId);
    res.redirect(Path.MyComments);
  } catch (error) {
    res.status(HttpCode.BAD_REQUEST).render(PageTemplate.InternalError);
  }
});

articlesRouter.get(Path.ArticlesByCategory, async (req, res) => {
  const {user} = req.session;
  let {id} = req.params;
  let {page = 1} = req.query;

  id = +id;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  try {
    const {articles} = await api.getArticles({limit, offset, withComments: true});
    const categories = await getCategories({withCount: true});

    const category = categories.find((categoryItem) => categoryItem.id === id);
    const articlesInCategory = articles.filter((article) => {
      return article.categories.some((categoryItem) => categoryItem.id === id);
    });
    const totalPages = Math.ceil(articlesInCategory.length / ARTICLES_PER_PAGE);
    const articlesByPage = articlesInCategory.slice(offset, offset + limit);

    res.render(PageTemplate.ArticlesByCategory, {id, articlesByPage, page, totalPages, category, categories, user});
  } catch (error) {
    res.status(HttpCode.BAD_REQUEST).render(PageTemplate.InternalError);
  }
});

module.exports = articlesRouter;
