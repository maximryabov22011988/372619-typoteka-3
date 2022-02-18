'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const api = require(`../api`).getAPI();
const {generateId} = require(`../../utils`);

const articlesRouter = new Router();

const UPLOAD_DIR = `../upload/img/`;
const upload = multer({
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, UPLOAD_DIR),
    filename: (req, file, cb) => {
      const uniqueName = generateId(10);
      const extension = file.originalname.split(`.`).pop();
      cb(null, `${uniqueName}.${extension}`);
    }
  })
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const newArticle = {
    title: body.title,
    picture: file ? file.filename : ``,
    category: body.category,
    announce: body.announce,
    fulltext: body.fulltext,
    createdDate: body.date,
  };

  try {
    await api.createArticle(newArticle);
    res.redirect(`/my`);
  } catch (_err) {
    res.redirect(`back`);
  }
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/posts-by-category`));

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`articles/post-add`, {categories});
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([api.getArticle(id), api.getCategories()]);
  res.render(`articles/post-edit`, {article, categories});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const articles = await api.getArticles();

  const article = articles.find((item) => item.id === id);
  const categoriesWithCount = articles.reduce((result, item) => {
    item.category.forEach((category) => {
      if (article.category.includes(category)) {
        if (result[category]) {
          result[category] += 1;
        } else {
          result[category] = 1;
        }
      }
    });

    return result;
  }, {});

  res.render(`articles/post`, {article, categories: Object.entries(categoriesWithCount)});
});

module.exports = articlesRouter;
