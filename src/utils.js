'use strict';

const {nanoid} = require(`nanoid`);

const DEFAULT_ID_SIZE = 6;
const generateId = (size = DEFAULT_ID_SIZE) => nanoid(size);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getRandomArrElement = (arr) => arr[getRandomInt(0, arr.length - 1)];
const getRandomArrElements = (arr, end = getRandomInt(1, arr.length - 1)) => shuffle(arr).slice(0, end);

const getText = (values, maxLength) => {
  return values.reduce((acc, value) => {
    const concatValues = `${acc} ${value}`;
    if (concatValues.length <= maxLength) {
      return concatValues;
    }

    return acc;
  }, ``);
};

const ensureArray = (value) => Array.isArray(value) ? value : [value];

const prepareErrors = (errors) => {
  return errors && errors.response && errors.response.data && errors.response.data.split(`\n`);
};

const validate = ({schema, data}) => schema.validate(data, {abortEarly: false});

const getErrorListStr = (error) => error.details.map((err) => err.message).join(`\n`);

module.exports = {
  generateId,
  getRandomInt,
  getRandomArrElement,
  getRandomArrElements,
  getText,
  ensureArray,
  prepareErrors,
  validate,
  getErrorListStr
};
