'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {ExitCode} = require(`../../constants`);
const {
  getRandomInt,
  getRandomArrElement,
  getRandomArrElements,
  getText
} = require(`../../utils`);

const DEFAULT_COUNT = 3;
const MIN_COMMENTS = 2;
const MAX_COMMENTS = 4;
const MAX_ANNOUNCE_LENGTH = 250;
const MAX_FULLTEXT_LENGTH = 1000;

const FILE_NAME = `db/fill.sql`;

const TITLES_FILE_PATH = `./data/titles.txt`;
const SENTENCES_FILE_PATH = `./data/sentences.txt`;
const CATEGORIES_FILE_PATH = `./data/categories.txt`;
const COMMENTS_FILE_PATH = `./data/comments.txt`;
const PICTURES_FILE_PATH = `./data/pictures.txt`;

const roles = [`Guest`, `Reader`, `Author`];
const getRoleId = (roleName) => {
  const roleIndex = roles.findIndex((role) => role === roleName) || 0;
  return roleIndex + 1;
};

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar-1.png`,
    roleId: getRoleId(`Reader`)
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf88`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar-2.png`,
    roleId: getRoleId(`Author`)
  }
];
const getAuthorId = () => users.findIndex((user) => user.roleId === getRoleId(`Author`)) + 1;

const generateComments = ({count, userCount, comments, articleId}) =>
  Array.from({length: count}, () => ({
    articleId,
    userId: getRandomInt(1, userCount),
    text: getRandomArrElements(comments).join(` `)
  }));

const generateArticles = ({count, categoryCount, userCount, titles, pictures, sentences, comments}) => (
  Array.from({length: count}, (_, index) =>
    ({
      title: getRandomArrElement(titles),
      picture: getRandomArrElement(pictures),
      announce: getText(getRandomArrElements(sentences, 5), MAX_ANNOUNCE_LENGTH),
      fullText: getText(getRandomArrElements(sentences), MAX_FULLTEXT_LENGTH),
      category: [getRandomInt(1, categoryCount)],
      comments: generateComments({
        comments,
        userCount,
        count: getRandomInt(MIN_COMMENTS, MAX_COMMENTS),
        articleId: index + 1
      }),
      userId: getAuthorId()
    }))
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

const disableAllTableTrigger = (tableName, isDisabled = true) => {
  return `ALTER TABLE ${tableName} ${isDisabled ? `DISABLE` : `ENABLE`} TRIGGER ALL;`;
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const titles = await readContent(TITLES_FILE_PATH);
    const pictures = await readContent(PICTURES_FILE_PATH);
    const sentences = await readContent(SENTENCES_FILE_PATH);
    const categories = await readContent(CATEGORIES_FILE_PATH);
    const commentSentences = await readContent(COMMENTS_FILE_PATH);

    const [count] = args;
    const articlesCount = Number.parseInt(count, 10) || DEFAULT_COUNT;


    const articles = generateArticles({
      titles,
      sentences,
      pictures,
      count: articlesCount,
      categoryCount: categories.length,
      userCount: users.length,
      comments: commentSentences
    });


    const comments = articles.flatMap((article) => article.comments);
    const articlesCategories = articles.map((article, index) => ({articleId: index + 1, categoryId: article.category[0]}));


    const roleValues = roles.map((role) => `('${role}')`).join(`,\n`);

    const userValues = users.map(
        ({email, passwordHash, firstName, lastName, avatar, roleId}) =>
          `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}', ${roleId})`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles.map(
        ({title, announce, fullText, picture, userId}) =>
          `('${title}', '${announce}', '${fullText}', '${picture}', ${userId})`
    ).join(`,\n`);


    const articleCategoryValues = articlesCategories.map(
        ({articleId, categoryId}) =>
          `(${articleId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(
        ({userId, articleId, text}) =>
          `(${userId}, ${articleId}, '${text}')`
    ).join(`,\n`);

    const content = `-- Добавляем роли
INSERT INTO roles(name) VALUES 
${roleValues};

-- Добавляем пользователей
${disableAllTableTrigger(`users`)}
INSERT INTO users(email, password_hash, first_name, last_name, avatar, role_id) VALUES
${userValues};
${disableAllTableTrigger(`users`, false)}

-- Добавляем категории
INSERT INTO categories(name) VALUES
${categoryValues};

-- Добавляем публикации
${disableAllTableTrigger(`articles`)}
INSERT INTO articles(title, announce, fullText, picture, user_id) VALUES
${articleValues};
${disableAllTableTrigger(`articles`, false)}

-- Добавляем комментарии
${disableAllTableTrigger(`comments`)}
INSERT INTO COMMENTS(user_id, article_id, text) VALUES
${commentValues};
${disableAllTableTrigger(`comments`, false)}

-- Добавляем связи между публикациями и категориями
${disableAllTableTrigger(`articles_categories`)}
INSERT INTO articles_categories(article_id, category_id) VALUES
${articleCategoryValues};
${disableAllTableTrigger(`articles_categories`, false)}`;


    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (e) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
