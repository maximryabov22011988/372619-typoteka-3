'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {ARTICLES_PER_PAGE} = require(`./constants`);
const {prepareErrors} = require(`../../utils`);

const Path = {
  Main: `/`,
  Search: `/search`,
  Categories: `/categories`,
  SignUp: `/register`,
  Login: `/login`,
  Logout: `/logout`
};

const PageTemplate = {
  Main: `main/index`,
  Search: `main/search`,
  Categories: `main/all-categories`,
  SignUp: `main/sign-up`,
  Login: `main/login`
};

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

mainRouter.get(Path.Main, async (req, res) => {
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
  res.render(PageTemplate.Main, {articles: mappedArticles, page, totalPages, categories, user});
});

mainRouter.get(Path.SignUp, async (req, res) => {
  const {user} = req.session;
  res.render(PageTemplate.SignUp, {user, userData: {
    avatar: ``,
    firstName: ``,
    lastName: ``,
    email: ``,
  }});
});

mainRouter.post(Path.SignUp, upload.single(`upload`), async (req, res) => {
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
    res.redirect(Path.Login);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(PageTemplate.SignUp, {validationMessages, userData, user});
  }
});

mainRouter.get(Path.Login, (req, res) => {
  const {user} = req.session;
  res.render(PageTemplate.Login, {user, userData: {email: ``}});
});

mainRouter.post(Path.Login, async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await api.auth(email, password);
    req.session.user = user;
    res.redirect(Path.Main);
  } catch (errors) {
    const validationMessages = errors.response.data.split(`\n`);
    const {user} = req.session;
    res.render(PageTemplate.Login, {user, validationMessages, userData: {email}});
  }
});

mainRouter.get(Path.Logout, async (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

mainRouter.get(Path.Search, async (req, res) => {
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
    res.render(PageTemplate.Search, {results: resultsWithHighlightTitle, query, user});
  } catch (err) {
    res.render(PageTemplate.Search, {results: [], query, user});
  }
});

mainRouter.get(Path.Categories, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(PageTemplate.Categories, {categories, user});
});

module.exports = mainRouter;
