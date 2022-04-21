'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);
const articleAPI = require(`./article`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Жизнь`,
  `Кино`,
  `Деревья`,
];

const mockArticles = [
  {
    "title": `Что такое золотое сечение. Что такое золотое сечение`,
    "createdDate": `2021-02-11`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "fulltext": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "categories": [
      `Жизнь`,
    ],
    "comments": [
      {
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы! Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Совсем немного...`
      },
      {
        "text": `Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Планируете записать видосик на эту тему?`
      },
      {
        "text": `Совсем немного... Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Мне кажется или я уже читал это где-то? Согласен с автором!`
      }
    ]
  },
  {
    "title": `Как достигнуть успеха не вставая с кресла`,
    "createdDate": `2021-02-11`,
    "announce": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Как начать действовать? Для начала просто соберитесь. Простые ежедневные упражнения помогут достичь успеха.`,
    "fulltext": `Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Достичь успеха помогут ежедневные повторения. Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов. Программировать не настолько сложно, как об этом говорят. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Он становился 6 раз чемпионом NBA. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Золотое сечение — соотношение двух величин, гармоническая пропорция. Простые ежедневные упражнения помогут достичь успеха.`,
    "categories": [
      `Кино`,
    ],
    "comments": [
      {
        "text": `Это где ж такие красоты? Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного... Плюсую, но слишком много буквы!`
      }
    ]
  },
  {
    "title": `Самый лучший музыкальный альбом этого года`,
    "createdDate": `2021-02-11`,
    "announce": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году. Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения.`,
    "fulltext": `Программировать не настолько сложно, как об этом говорят. Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Он становился 6 раз чемпионом NBA. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов. Достичь успеха помогут ежедневные повторения. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Первая большая ёлка была установлена только в 1938 году. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Как начать действовать? Для начала просто соберитесь.`,
    "categories": [
      `Деревья`,
    ],
    "comments": [
      {
        "text": `Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы! Согласен с автором!`
      },
      {
        "text": `Согласен с автором! Согласен с автором! Согласен с автором! Согласен с автором! Согласен с автором!`
      }
    ]
  },
  {
    "title": `Обзор новейшего смартфона. Обзор новейшего смартфона`,
    "createdDate": `2021-02-11`,
    "announce": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов.`,
    "fulltext": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Как начать действовать? Для начала просто соберитесь. Золотое сечение — соотношение двух величин, гармоническая пропорция. Простые ежедневные упражнения помогут достичь успеха. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Это один из лучших рок-музыкантов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Он написал больше 30 хитов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    "categories": [
      `Кино`,
      `Деревья`
    ],
    "comments": [
      {
        "text": `Мне кажется или я уже читал это где-то? Мне кажется или я уже читал это где-то? Мне кажется или я уже читал это где-то?`
      },
      {
        "text": `Плюсую, но слишком много буквы! Плюсую, но слишком много буквы! Плюсую, но слишком много буквы!`
      }
    ]
  },
  {
    "title": `Ёлки. История деревьев. Ёлки. История деревьев`,
    "createdDate": `2021-02-11`,
    "announce": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он становился 6 раз чемпионом NBA. Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "fulltext": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Программировать не настолько сложно, как об этом говорят. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов. Он становился 6 раз чемпионом NBA. Ёлки — это не просто красивое дерево. Это прочная древесина. Золотое сечение — соотношение двух величин, гармоническая пропорция. Первая большая ёлка была установлена только в 1938 году.`,
    "categories": [
      `Жизнь`,
    ],
    "comments": [
      {
        "text": `Мне кажется или я уже читал это где-то? Мне кажется или я уже читал это где-то? Мне кажется или я уже читал это где-то?`
      },
      {
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором! Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему?`
      },
      {
        "text": `Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Плюсую, но слишком много буквы! Хочу такую же футболку :-)`
      },
      {
        "text": `Хочу такую же футболку :-) Планируете записать видосик на эту тему? Это где ж такие красоты? Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles});

  const app = express();
  app.use(express.json());
  articleAPI(app, new ArticleService(mockDB), new CommentService(mockDB));

  return app;
};

describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 5 articles`, () => expect(response.body.length).toBe(5));
});

describe(`API returns an article with given id`, () => {
  let response;
  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article's title is "Что такое золотое сечение. Что такое золотое сечение"`, () => expect(response.body.title).toBe(`Что такое золотое сечение. Что такое золотое сечение`));
});

describe(`API returns code 404 if non-existent article id`, () => {
  let response;
  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/2000000`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    "title": `Что такое золотое сечение. Что такое золотое сечение`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. `,
    "fulltext": `Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "categories": [1],
    "createdDate": `2021-02-11`,
  };

  let app;
  let response;
  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Articles count is changed`, () => request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    "title": `Что такое золотое сечение`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. `,
    "fulltext": `Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "categories": [1],
    "createdDate": `2021-02-11`,
  };

  let app;
  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const invalidArticle = {...newArticle};
      delete invalidArticle[key];
      await request(app).post(`/articles`).send(invalidArticle).expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badOffers = [
      {...newArticle, picture: 12345},
      {...newArticle, categories: `Мороженка`}
    ];
    for (const badOffer of badOffers) {
      await request(app).post(`/articles`).send(badOffer).expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badOffers = [
      {...newArticle, title: `too short`},
      {...newArticle, categories: []}
    ];
    for (const badOffer of badOffers) {
      await request(app).post(`/articles`).send(badOffer).expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    "title": `Новый длинный заголовок для новой статьи`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения.`,
    "fulltext": `Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "categories": [1],
    "createdDate": `2021-02-11`,
  };

  let app;
  let response;
  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/articles/2`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article is really changed`, () => request(app).get(`/articles/2`).expect((res) => expect(res.body.title).toBe(`Новый длинный заголовок для новой статьи`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const validArticle = {
    "title": `Это`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. `,
    "fulltext": `Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "categories": [1],
    "createdDate": `2021-02-11`,
  };
  const app = await createAPI();
  return request(app).put(`/articles/200000`).send(validArticle).expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const invalidArticle = {
    "title": `Это`,
    "announce": `не валидная статья`,
    "categories": [1, 2],
    "createdDate": `2021-02-11`,
  };
  const app = await createAPI();
  return request(app).put(`/articles/2`).send(invalidArticle).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;
  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/3`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article count is 4 now`, () => request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();
  return request(app).delete(`/articles/200000`).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();
  return request(app).post(`/articles/200000/comments`).send({text: `Неважно`}).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();
  return request(app).delete(`/articles/1/comments/UNKNOWN`).expect(HttpCode.BAD_REQUEST);
});

describe(`API returns a list of comments to given article`, () => {
  let response;
  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидный коммент. Валидный коммент. Валидный коммент`
  };

  let app;
  let response;
  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles/1/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Comments count is changed`, () => request(app).get(`/articles/1/comments`).expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = await createAPI();
  return request(app).post(`/articles/1/comments`).send({}).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let app;
  let response;
  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Comments count is 3 now`, () => request(app).get(`/articles/1/comments`).expect((res) => expect(res.body.length).toBe(2)));
});

test(`API refuses to delete a comment to non-existent article`, async () => {
  const app = await createAPI();
  return request(app).delete(`/articles/200000/comments/1`).expect(HttpCode.NOT_FOUND);
});
