'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {
  MOCK_FILENAME,
  ExitCode
} = require(`../../constants`);
const {
  generateId,
  getRandomInt,
  getRandomArrElement,
  getRandomArrElements,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const MAX_COMMENTS = 4;
const MAX_COUNT_ERROR_MESSAGE = `Не больше ${MAX_COUNT} публикаций`;

const TITLES_FILE_PATH = `./data/titles.txt`;
const SENTENCES_FILE_PATH = `./data/sentences.txt`;
const CATEGORIES_FILE_PATH = `./data/categories.txt`;
const COMMENTS_FILE_PATH = `./data/comments.txt`;
const PICTURES_FILE_PATH = `./data/pictures.txt`;

const formatDate = (date) => {
  if (date instanceof Date) {
    return date.toISOString().replace(/T/, ` `).replace(/\..+/, ``);
  }

  return date;
};

// last three month (include current month)
const LAST_MONTH_COUNT = 3;

const createDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const date = currentDate.getDate();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const lastThreeMonthDate = new Date(year, month - LAST_MONTH_COUNT, date, hours, minutes, seconds);
  const randomDateInMs = getRandomInt(+lastThreeMonthDate, +currentDate);

  return new Date(randomDateInMs);
};

const getComments = (comments, articleTitle) =>
  Array.from({length: getRandomInt(1, MAX_COMMENTS)}, () => ({
    id: generateId(),
    text: getRandomArrElements(comments).join(` `),
    createdDate: formatDate(createDate()),
    articleTitle
  }));

const generateArticles = ({count, titles, pictures, sentences, categories, comments}) => (
  Array.from({length: count}, () => {
    const title = getRandomArrElement(titles);
    return ({
      id: generateId(),
      title,
      picture: getRandomArrElement(pictures),
      announce: getRandomArrElements(sentences, 5).join(` `),
      fullText: getRandomArrElements(sentences).join(` `),
      createdDate: formatDate(createDate()),
      category: getRandomArrElements(categories, 5),
      comments: getComments(comments, title),
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
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const articlesCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (articlesCount > MAX_COUNT) {
      console.error(chalk.red(MAX_COUNT_ERROR_MESSAGE));
      process.exit(ExitCode.ERROR);
    }

    const titles = await readContent(TITLES_FILE_PATH);
    const pictures = await readContent(PICTURES_FILE_PATH);
    const sentences = await readContent(SENTENCES_FILE_PATH);
    const categories = await readContent(CATEGORIES_FILE_PATH);
    const comments = await readContent(COMMENTS_FILE_PATH);
    const articles = generateArticles({
      count: articlesCount,
      titles,
      pictures,
      sentences,
      categories,
      comments
    });
    const content = JSON.stringify(articles, null, 2);

    try {
      await fs.writeFile(MOCK_FILENAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (e) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
