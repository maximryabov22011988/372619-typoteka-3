'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const auth = require(`../middlewares/auth`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {ARTICLES_PER_PAGE} = require(`./constants`);
const {ensureArray, prepareErrors} = require(`../../utils`);

const Path = {
  CreateArticle: `/add`,
  EditArticle: `/edit/:id`,
  ViewArticle: `/:id`,
  MyArticles: `/my`,
  ArticleComments: `/:id/comments`,
  ArticlesByCategory: `/category/:id`
};

const PageTemplate = {
  CreateArticle: `articles/post-add`,
  EditArticle: `articles/post-edit`,
  ViewArticle: `articles/post`,
  ArticlesByCategory: `articles/posts-by-category`
};

const articlesRouter = new Router();
const csrfProtection = csrf();

const getCategories = () => api.getCategories();

const getArticleData = async ({id, withComments = false, withCount = false}) => {
  const [article, categories] = await Promise.all([api.getArticle(id, {withComments}), getCategories({withCount})]);
  return {article, categories};
};

articlesRouter.get(Path.CreateArticle, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const categories = await getCategories();
  res.render(PageTemplate.CreateArticle, {categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(Path.CreateArticle, auth, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;

  const newArticle = {
    title: body.title,
    picture: file ? file.filename : ``,
    categories: body.categories,
    announce: body.announce,
    fulltext: body.fulltext,
    createdDate: body.date,
  };

  try {
    await api.createArticle(newArticle);
    res.redirect(Path.MyArticles);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getCategories();
    res.render(PageTemplate.CreateArticle, {categories, validationMessages, user, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(Path.EditArticle, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const articleData = await getArticleData({id});
  res.render(PageTemplate.EditArticle, {id, ...articleData, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(Path.EditArticle, auth, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {body, file} = req;

  const updatedArticle = {
    title: body.title,
    picture: file ? file.filename : body[`old-image`],
    categories: ensureArray(body.categories),
    announce: body.announce,
    fulltext: body.fulltext,
    createdDate: body.date,
  };

  try {
    await api.editArticle(id, updatedArticle);
    res.redirect(Path.MyArticles);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const articleData = await getArticleData({id});
    res.render(PageTemplate.EditArticle, {id, ...articleData, validationMessages, user});
  }
});

articlesRouter.get(Path.ViewArticle, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const articleData = await getArticleData({id, withComments: true, withCount: true});
  res.render(PageTemplate.ViewArticle, {id, ...articleData, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(Path.ArticleComments, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const articleData = await getArticleData({id, withComments: true, withCount: true});
    res.render(PageTemplate.ViewArticle, {...articleData, validationMessages, user});
  }
});

articlesRouter.get(Path.ArticlesByCategory, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  let {page = 1} = req.query;

  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const posts = await api.getArticles({limit, offset});
  const categories = await api.getCategories({withCount: true});
  res.render(PageTemplate.ArticlesByCategory, {id, posts, categories, user});
});

module.exports = articlesRouter;
