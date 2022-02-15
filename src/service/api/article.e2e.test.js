'use strict';

const express = require(`express`);
const request = require(`supertest`);

const articleAPI = require(`./article`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `aY1vtd`,
    "title": `Что такое золотое сечение`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "fullText": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "createdDate": `2022-02-02 17:31:48`,
    "category": [
      `Жизнь`,
      `Кино`,
      `Деревья`,
      `Рамки`,
      `Музыка`,
      `Разное`,
      `Авто`,
      `Водный спорт`,
      `Мото`,
      `Программирование`
    ],
    "comments": [
      {
        "id": `hRQYfY`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы! Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Совсем немного...`
      },
      {
        "id": `r2zQBw`,
        "text": `Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Планируете записать видосик на эту тему?`
      },
      {
        "id": `9XQw1f`,
        "text": `Совсем немного... Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Мне кажется или я уже читал это где-то? Согласен с автором!`
      }
    ]
  },
  {
    "id": `YY6CPb`,
    "title": `Как достигнуть успеха не вставая с кресла`,
    "announce": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Как начать действовать? Для начала просто соберитесь. Простые ежедневные упражнения помогут достичь успеха.`,
    "fullText": `Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой. Достичь успеха помогут ежедневные повторения. Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов. Программировать не настолько сложно, как об этом говорят. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Он становился 6 раз чемпионом NBA. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Золотое сечение — соотношение двух величин, гармоническая пропорция. Простые ежедневные упражнения помогут достичь успеха.`,
    "createdDate": `2021-11-24 05:10:11`,
    "category": [
      `Рамки`,
      `Авто`,
      `Жизнь`
    ],
    "comments": [
      {
        "id": `GIqe6u`,
        "text": `Это где ж такие красоты? Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного... Плюсую, но слишком много буквы!`
      }
    ]
  },
  {
    "id": `p-PXrX`,
    "title": `Самый лучший музыкальный альбом этого года`,
    "announce": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году. Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения.`,
    "fullText": `Программировать не настолько сложно, как об этом говорят. Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Он становился 6 раз чемпионом NBA. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов. Достичь успеха помогут ежедневные повторения. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Первая большая ёлка была установлена только в 1938 году. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Как начать действовать? Для начала просто соберитесь.`,
    "createdDate": `2021-12-09 21:55:17`,
    "category": [
      `Авто`,
      `Программирование`,
      `Железо`,
      `Жизнь`,
      `Мото`,
      `Деревья`,
      `IT`,
      `Музыка`,
      `Кино`,
      `Разное`,
      `Водный спорт`
    ],
    "comments": [
      {
        "id": `Vzvksj`,
        "text": `Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы! Согласен с автором!`
      },
      {
        "id": `ev-zN4`,
        "text": `Согласен с автором!`
      }
    ]
  },
  {
    "id": `qmGOPE`,
    "title": `Обзор новейшего смартфона`,
    "announce": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов.`,
    "fullText": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Программировать не настолько сложно, как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Как начать действовать? Для начала просто соберитесь. Золотое сечение — соотношение двух величин, гармоническая пропорция. Простые ежедневные упражнения помогут достичь успеха. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Это один из лучших рок-музыкантов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Он написал больше 30 хитов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    "createdDate": `2022-02-05 00:30:01`,
    "category": [
      `Музыка`,
      `IT`
    ],
    "comments": [
      {
        "id": `qvR36A`,
        "text": `Мне кажется или я уже читал это где-то?`
      },
      {
        "id": `F3AGRK`,
        "text": `Плюсую, но слишком много буквы!`
      }
    ]
  },
  {
    "id": `MRw8I6`,
    "title": `Ёлки. История деревьев`,
    "announce": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он становился 6 раз чемпионом NBA. Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "fullText": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Программировать не настолько сложно, как об этом говорят. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов. Он становился 6 раз чемпионом NBA. Ёлки — это не просто красивое дерево. Это прочная древесина. Золотое сечение — соотношение двух величин, гармоническая пропорция. Первая большая ёлка была установлена только в 1938 году.`,
    "createdDate": `2021-12-02 22:01:38`,
    "category": [
      `Рамки`,
      `Водный спорт`,
      `Деревья`,
      `Музыка`,
      `IT`,
      `Кино`,
      `Авто`,
      `Жизнь`,
      `Мото`,
      `Разное`,
      `Программирование`
    ],
    "comments": [
      {
        "id": `bIb3yq`,
        "text": `Мне кажется или я уже читал это где-то?`
      },
      {
        "id": `Qda5N9`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором! Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему?`
      },
      {
        "id": `2j9C0J`,
        "text": `Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Плюсую, но слишком много буквы! Хочу такую же футболку :-)`
      },
      {
        "id": `6M8P66`,
        "text": `Хочу такую же футболку :-) Планируете записать видосик на эту тему? Это где ж такие красоты? Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  articleAPI(app, new ArticleService(cloneData), new CommentService());
  return app;
};


describe(`API returns a list of all articles`, () => {
  const app = createAPI();

  let response;
  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 5 articles`, () => expect(response.body.length).toBe(5));
  test(`First article's id equals "aY1vtd"`, () => expect(response.body[0].id).toBe(`aY1vtd`));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();

  let response;
  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/YY6CPb`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article's title is "Как достигнуть успеха не вставая с кресла"`, () => expect(response.body.title).toBe(`Как достигнуть успеха не вставая с кресла`));
});

describe(`API returns code 404 if non-existent article id`, () => {
  const app = createAPI();

  let response;
  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/116CPb`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
});

describe(`API creates an article if data is valid`, () => {
  const app = createAPI();
  const newArticle = {
    "title": `Что такое золотое сечение`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "createdDate": `2022-02-15 22:00:00`,
    "category": [`Жизнь`],
  };

  let response;
  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {
  const app = createAPI();
  const newArticle = {
    "title": `Что такое золотое сечение`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "createdDate": `2022-02-15 22:00:00`,
    "category": [`Жизнь`],
  };

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const invalidArticle = {...newArticle};
      delete invalidArticle[key];
      await request(app)
        .post(`/articles`)
        .send(invalidArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const app = createAPI();
  const newArticle = {
    "title": `Новый заголовок`,
    "announce": `Новый анонс`,
    "createdDate": `2022-02-15 22:30:00`,
    "category": [],
  };


  let response;
  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/aY1vtd`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Article is really changed`, () => request(app)
    .get(`/articles/aY1vtd`)
    .expect((res) => expect(res.body.title).toBe(`Новый заголовок`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();

  const validArticle = {
    "title": `Это`,
    "announce": `валидная статья`,
    "createdDate": `2022-02-15 22:30:00`,
    "category": [],
  };

  return request(app)
    .put(`/articles/AAAAAA`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();

  const invalidArticle = {
    "title": `Это`,
    "announce": `не валидная статья`,
    "createdDate": `2022-02-15 22:30:00`,
  };

  return request(app)
    .put(`/articles/aY1vtd`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();

  let response;
  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/aY1vtd`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted article`, () => expect(response.body.id).toBe(`aY1vtd`));
  test(`Article count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/AAAAAA`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/AAAAAA/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/aY1vtd/comments/UNKNOWN`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  const app = createAPI();

  let response;
  beforeAll(async () => {
    response = await request(app).get(`/articles/aY1vtd/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));
  test(`First comment's id is "hRQYfY"`, () => expect(response.body[0].id).toBe(`hRQYfY`));
});

describe(`API creates a comment if data is valid`, () => {
  const app = createAPI();

  const newComment = {
    text: `Валидный коммент`
  };

  let response;
  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/aY1vtd/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () => request(app).get(`/articles/aY1vtd/comments`).expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createAPI();
  return request(app).post(`/articles/aY1vtd/comments`).send({}).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();

  let response;
  beforeAll(async () => {
    response = await request(app).delete(`/articles/aY1vtd/comments/hRQYfY`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`hRQYfY`));
  test(`Comments count is 3 now`, () => request(app).get(`/articles/aY1vtd/comments`).expect((res) => expect(res.body.length).toBe(2)));
});

test(`API refuses to delete a comment to non-existent article`, () => {
  const app = createAPI();
  return request(app).delete(`/articles/AAAAAA/comments/hRQYfY`).expect(HttpCode.NOT_FOUND);
});
