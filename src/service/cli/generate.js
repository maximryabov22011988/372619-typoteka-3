'use strict';

const fs = require(`fs`);
const {
  ExitCode
} = require(`../../constants`);
const {
  getRandomInt,
  getRandomArrElement,
  getRandomArrElements,
} = require(`../../utils`);

const FILE_NAME = `mock.json`;
const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const MAX_COUNT_ERROR_MESSAGE = `Не больше ${MAX_COUNT} публикаций`;

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`
];

const DESCRIPTIONS = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];


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

const generatePublications = (count) => (
  Array.from({length: count}, () => ({
    title: getRandomArrElement(TITLES),
    announce: getRandomArrElements(DESCRIPTIONS, 5).join(` `),
    fullText: getRandomArrElements(DESCRIPTIONS).join(` `),
    createdDate: formatDate(createDate()),
    category: getRandomArrElements(CATEGORIES),
  }))
);

const errorHandler = (err) => err ? console.error(`Can't write data to file...`) : console.info(`Operation success. File created.`);

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const publicationsCount = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (publicationsCount > MAX_COUNT) {
      console.error(MAX_COUNT_ERROR_MESSAGE);
      process.exit(ExitCode.ERROR);
    }

    const content = JSON.stringify(generatePublications(publicationsCount), null, 2);
    fs.writeFile(FILE_NAME, content, errorHandler);
  }
};
