'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const isAdmin = require(`../middlewares/is-admin`);
const {ARTICLES_PER_PAGE} = require(`./constants`);
const {HttpCode} = require(`../../constants`);
const {prepareErrors} = require(`../../utils`);

const Path = {
  Main: `/`,
  Search: `/search`,
  SignUp: `/register`,
  Login: `/login`,
  Logout: `/logout`,
  CreateCategory: `/categories/add`,
  UpdateCategory: `/categories/:id/update`,
  DeleteCategory: `/categories/:id/delete`,
};

const PageTemplate = {
  Main: `main/index`,
  Search: `main/search`,
  SignUp: `main/sign-up`,
  Login: `main/login`,
  Categories: `my/categories`,
  InternalError: `errors/500`
};

const mainRouter = new Router();
const csrfProtection = csrf();

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

  try {
    const [{count, articles}, categories, popularArticles, latestComments] = await Promise.all([
      api.getArticles({
        withComments: true,
        offset: (page - 1) * ARTICLES_PER_PAGE,
        limit: ARTICLES_PER_PAGE
      }),
      api.getCategories({withCount: true}),
      api.getPopularArticles({withComments: true}),
      api.getLatestComments()
    ]);

    const mappedArticles = getArticlesWithCorrectImageFormat(articles);
    const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
    res.render(PageTemplate.Main, {popularArticles, latestComments, articles: mappedArticles, page, totalPages, categories, user});
  } catch (error) {
    res.status(HttpCode.BAD_REQUEST).render(PageTemplate.InternalError);
  }
});

mainRouter.get(Path.SignUp, csrfProtection, async (req, res) => {
  const {user} = req.session;
  res.render(PageTemplate.SignUp, {
    user,
    userData: {
      avatar: ``,
      firstName: ``,
      lastName: ``,
      email: ``,
    },
    currentUrl: req.url,
    csrfToken: req.csrfToken()
  });
});

mainRouter.post(Path.SignUp, [upload.single(`upload`), csrfProtection], async (req, res) => {
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
    res.render(PageTemplate.SignUp, {
      validationMessages,
      userData,
      user,
      currentUrl: req.url,
      csrfToken: req.csrfToken()
    });
  }
});

mainRouter.get(Path.Login, csrfProtection, (req, res) => {
  const {user} = req.session;
  res.render(PageTemplate.Login, {
    user,
    userData: {email: ``},
    currentUrl: req.url,
    csrfToken: req.csrfToken()
  });
});

mainRouter.post(Path.Login, csrfProtection, async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await api.auth(email, password);
    req.session.user = user;
    res.redirect(Path.Main);
  } catch (errors) {
    const validationMessages = errors.response.data.split(`\n`);
    const {user} = req.session;
    res.render(PageTemplate.Login, {
      user,
      validationMessages,
      userData: {email},
      currentUrl: req.url,
      csrfToken: req.csrfToken()
    });
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

mainRouter.post(Path.CreateCategory, async (req, res) => {
  const {user} = req.session;
  const {category} = req.body;

  try {
    await api.createCategory({name: category});
    res.redirect(`/my/categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();
    res.render(PageTemplate.Categories, {isNewCategory: true, newCategory: category, categories, user, validationMessages});
  }
});

mainRouter.post(Path.UpdateCategory, isAdmin, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  const {category} = req.body;

  try {
    await api.updateCategory(id, {name: category});
    res.redirect(`/my/categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();
    res.render(PageTemplate.Categories, {isNewCategory: false, categories, user, validationMessages});
  }
});

mainRouter.get(Path.DeleteCategory, isAdmin, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;

  try {
    await api.deleteCategory(id);
    res.redirect(`/my/categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();
    res.render(PageTemplate.Categories, {categories, user, validationMessages});
  }
});

module.exports = mainRouter;
