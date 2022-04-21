'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const api = require(`../api`).getAPI();
const {generateId, ensureArray, prepareErrors} = require(`../../utils`);

const articlesRouter = new Router();

const getCategories = () => api.getCategories();

const getArticleData = async ({id, withComments = false, withCount = false}) => {
  const [article, categories] = await Promise.all([api.getArticle(id, {withComments}), getCategories({withCount})]);
  return {article, categories};
};

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await getCategories();
  res.render(`articles/post-add`, {categories});
});

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
    res.render(`articles/post-add`, {categories, validationMessages});
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const articleData = await getArticleData({id});
  res.render(`articles/post-edit`, {id, ...articleData});
});

articlesRouter.post(`/edit/:id`, upload.single(`upload`), async (req, res) => {
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
    res.render(`articles/post-edit`, {id, ...articleData, validationMessages});
  }
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const articleData = await getArticleData({id, withComments: true, withCount: true});
  res.render(`articles/post`, {id, ...articleData});
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const articleData = await getArticleData({id, withComments: true, withCount: true});
    res.render(`articles/post`, {...articleData, validationMessages});
  }
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/posts-by-category`));

module.exports = articlesRouter;
