'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const auth = require(`../middlewares/auth`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {ARTICLES_PER_PAGE} = require(`./constants`);
const {ensureArray, prepareErrors} = require(`../../utils`);

const articlesRouter = new Router();
const csrfProtection = csrf();

const getCategories = () => api.getCategories();

const getArticleData = async ({id, withComments = false, withCount = false}) => {
  const [article, categories] = await Promise.all([api.getArticle(id, {withComments}), getCategories({withCount})]);
  return {article, categories};
};

articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const categories = await getCategories();
  res.render(`articles/post-add`, {categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/add`, auth, csrfProtection, upload.single(`upload`), async (req, res) => {
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
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getCategories();
    res.render(`articles/post-add`, {categories, validationMessages, user, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const articleData = await getArticleData({id});
  res.render(`articles/post-edit`, {id, ...articleData, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/edit/:id`, auth, csrfProtection, upload.single(`upload`), async (req, res) => {
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
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const articleData = await getArticleData({id});
    res.render(`articles/post-edit`, {id, ...articleData, validationMessages, user});
  }
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const articleData = await getArticleData({id, withComments: true, withCount: true});
  res.render(`articles/post`, {id, ...articleData, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/:id/comments`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const articleData = await getArticleData({id, withComments: true, withCount: true});
    res.render(`articles/post`, {...articleData, validationMessages, user});
  }
});

articlesRouter.get(`/category/:id`, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  let {page = 1} = req.query;

  page = +page;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const posts = await api.getArticles({limit, offset});
  const categories = await api.getCategories({withCount: true});
  res.render(`articles/posts-by-category`, {id, posts, categories, user});
});

module.exports = articlesRouter;
