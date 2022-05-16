'use strict';

const {HttpCode} = require(`../../constants`);

const getEndOfWordByCount = (count, {one, twoOrMore, fiveOrMore}) => {
  if (count === 1) {
    return one;
  }
  if (count >= 2 && count < 5) {
    return twoOrMore;
  }

  return fiveOrMore;
};


module.exports = (categoryService) => async (req, res, next) => {
  const {id} = req.params;
  const count = await categoryService.countByCategory(id);

  if (count) {
    res.status(HttpCode.BAD_REQUEST).send(`Нельзя удалить категорию, к ней привязан${getEndOfWordByCount(count, {one: `а`, twoOrMore: `ы`, fiveOrMore: `о`})} ${count} публикаци${getEndOfWordByCount(count, {one: `я`, twoOrMore: `и`, fiveOrMore: `й`})}!`);
    return;
  }

  next();
};
