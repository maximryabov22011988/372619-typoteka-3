'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {ARTICLES_PER_PAGE} = require(`./constants`);
const {prepareErrors} = require(`../../utils`);

const mainRouter = new Router();

const IMAGE_FORMATS = [`.jpg`, `.jpeg`, `.png`, `.webp`];
const getArticlesWithCorrectImageFormat = (articles, postfix = `@1x`, ext = `jpg`) => {
  return articles.map((article) => {
    const hasFormat = IMAGE_FORMATS.some((format) => article.picture && article.picture.includes(format));
    if (!hasFormat) {
      article.picture = `${article.picture}${postfix}.${ext}`;
    }

    return article;
  });
};

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  page = Number(page);

  const [{count, articles}, categories] = await Promise.all([
    api.getArticles({
      withComments: true,
      offset: (page - 1) * ARTICLES_PER_PAGE,
      limit: ARTICLES_PER_PAGE
    }),
    api.getCategories({withCount: true})
  ]);
  const mappedArticles = getArticlesWithCorrectImageFormat(articles);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  res.render(`main/index`, {articles: mappedArticles, page, totalPages, categories, user});
});

mainRouter.get(`/register`, async (req, res) => {
  const {user} = req.session;
  res.render(`main/sign-up`, {user, userData: {
    avatar: ``,
    firstName: ``,
    lastName: ``,
    email: ``,
  }});
});

mainRouter.post(`/register`, upload.single(`upload`), async (req, res) => {
  const {user} = req.session;
  const {body: formValues, file} = req;
  const userData = {
    avatar: file ? file.filename : ``,
    firstName: formValues.firstName || ``,
    lastName: formValues.lastName || ``,
    email: formValues.email || ``,
    password: formValues.password,
    passwordRepeated: formValues[`repeat-password`]
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`main/sign-up`, {validationMessages, userData, user});
  }
});

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;
  res.render(`main/login`, {user, userData: {email: ``}});
});

mainRouter.post(`/login`, async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await api.auth(email, password);
    req.session.user = user;
    res.redirect(`/`);
  } catch (errors) {
    const validationMessages = errors.response.data.split(`\n`);
    const {user} = req.session;
    res.render(`main/login`, {user, validationMessages, userData: {email}});
  }
});

mainRouter.get(`/logout`, async (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;
  const {query} = req.query;
  try {
    const results = await api.search(query);
    const resultsWithHighlightTitle = results.map((article) => {
      const index = article.title.toLowerCase().indexOf(query.toLowerCase());
      return {
        ...article,
        title: [
          {text: article.title.slice(0, index), type: `simple`},
          {text: article.title.slice(index, index + query.length), type: `bold`},
          {text: article.title.slice(index + query.length), type: `simple`},
        ]
      };
    });
    res.render(`main/search`, {results: resultsWithHighlightTitle, query, user});
  } catch (err) {
    res.render(`main/search`, {results: [], query, user});
  }
});

mainRouter.get(`/categories`, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`main/all-categories`, {categories, user});
});

module.exports = mainRouter;
