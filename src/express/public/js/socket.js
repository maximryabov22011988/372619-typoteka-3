const DEFAULT_PORT_SERVER = 3000;
const ARTICLES_PER_PAGE = 8;

const SocketAction = {
  CREATE_ARTICLE: `article:created`,
  CREATE_COMMENT: `comment:created`,
};

const parseDate = (dateString) => {
  const date = new Date(dateString);
  let [year, month, day, hours, minutes] = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];

  const pad = (number) => (number < 10 ? `0${number}` : number);

  return `${pad(day)}.${pad(month)}.${year}, ${pad(hours)}:${pad(minutes)}`;
};

(() => {
  const SERVER_URL = `http://localhost:${DEFAULT_PORT_SERVER}`;
  const socket = io(SERVER_URL);

  const createCategoriesElement = (categories) => {
    const fragment = document.createDocumentFragment();

    categories.forEach((category) => {
      const categoryItemElement = document.createElement(`li`);
      categoryItemElement.classList.add(`preview__breadcrumbs-item`);

      const categoryLinkElement = document.createElement(`a`);
      categoryLinkElement.classList.add(`preview__breadcrumbs-link`);
      categoryLinkElement.href = `/articles/category/${category.id}`;
      categoryLinkElement.textContent = category.name;

      categoryItemElement.append(categoryLinkElement);
      fragment.append(categoryItemElement);
    });

    return fragment;
  };

  const createArticleElement = (article) => {
    const articleTemplate = document.querySelector(`#preview-template`);
    const articleCardElement = articleTemplate.cloneNode(true).content;

    if (article.picture) {
      articleCardElement.querySelector(`.preview__background img`)
        .src = `/img/${article.picture}`;
    } else {
      articleCardElement.querySelector(`.preview__background`).remove();
    }

    articleCardElement.querySelector(`.preview__time`)
      .dateTime = article.createdAt;
    articleCardElement.querySelector(`.preview__time`)
      .textContent = parseDate(article.createdDate);
    articleCardElement.querySelector(`.preview__name a`)
      .href = `/articles/${article.id}`;
    articleCardElement.querySelector(`.preview__name a`)
      .textContent = article.title;
    articleCardElement.querySelector(`.preview__text`)
      .textContent = article.announce;
    articleCardElement.querySelector(`.preview__comment`)
      .href = `/articles/${article.id}`;
    articleCardElement.querySelector(`.preview__comment-count`)
      .textContent = article.comments.length;

    articleCardElement
      .querySelector(`.preview__breadcrumbs`)
      .append(createCategoriesElement(article.categories));

    return articleCardElement;
  };

  const updatePreviewList = (article) => {
    const previewListElement = document.querySelector(`.preview__list`);
    const previewItems = [...previewListElement.querySelectorAll(`.preview__item`)];
    const newPreviewItem = createArticleElement(article);

    for (const previewItem of previewItems) {
      const timeElement = previewItem.querySelector(`time`);

      if (timeElement.dateTime <= article.createdDate) {
        previewListElement.insertBefore(newPreviewItem, previewItem);

        if (previewItems.length === ARTICLES_PER_PAGE) {
          previewItems[previewItems.length - 1].remove();
        }
        return;
      }
    }
  };

  socket.addEventListener(SocketAction.CREATE_ARTICLE, updatePreviewList);
})();