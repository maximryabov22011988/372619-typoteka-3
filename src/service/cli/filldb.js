'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {logger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const initDB = require(`../lib/init-db`);
const {ExitCode} = require(`../../constants`);
const {
  getRandomInt,
  getRandomArrElement,
  getRandomArrElements,
  getText
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const MAX_ANNOUNCE_LENGTH = 250;
const MAX_FULLTEXT_LENGTH = 1000;
const MAX_COMMENT_LENGTH = 1000;
const MAX_COMMENTS = 4;
const MAX_COUNT_ERROR_MESSAGE = `Не больше ${MAX_COUNT} публикаций`;

const TITLES_FILE_PATH = `./data/titles.txt`;
const SENTENCES_FILE_PATH = `./data/sentences.txt`;
const CATEGORIES_FILE_PATH = `./data/categories.txt`;
const COMMENTS_FILE_PATH = `./data/comments.txt`;
const PICTURES_FILE_PATH = `./data/pictures.txt`;

const getComments = (comments) =>
  Array.from({length: getRandomInt(1, MAX_COMMENTS)}, () => ({
    text: getText(getRandomArrElements(comments), MAX_COMMENT_LENGTH),
  }));

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};


const generateArticles = ({count, titles, pictures, sentences, categories, comments}) => (
  Array.from({length: count}, () => {
    const title = getRandomArrElement(titles);
    return ({
      title,
      picture: getRandomArrElement(pictures),
      announce: getText(getRandomArrElements(sentences, 5), MAX_ANNOUNCE_LENGTH),
      fulltext: getText(getRandomArrElements(sentences), MAX_FULLTEXT_LENGTH),
      categories: getRandomSubarray(categories),
      comments: getComments(comments),
    });
  })
);

const readContent = async (filepath) => {
  try {
    const content = await fs.readFile(filepath, `utf-8`);
    return content.trim().split(`\n`);
  } catch (e) {
    console.error(chalk.red(e));
    return [];
  }
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    const [count] = args;
    const articlesCount = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (articlesCount > MAX_COUNT) {
      console.error(chalk.red(MAX_COUNT_ERROR_MESSAGE));
      process.exit(ExitCode.ERROR);
    }

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);


    const [titles, pictures, sentences, categories, comments] = await Promise.all([
      await readContent(TITLES_FILE_PATH),
      await readContent(PICTURES_FILE_PATH),
      await readContent(SENTENCES_FILE_PATH),
      await readContent(CATEGORIES_FILE_PATH),
      await readContent(COMMENTS_FILE_PATH)
    ]);

    const articles = generateArticles({
      count: articlesCount,
      titles,
      pictures,
      sentences,
      categories,
      comments
    });

    return initDB(sequelize, {categories, articles});
  }
};
