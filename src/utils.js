'use strict';

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

module.exports = {
  getRandomInt,
  getRandomArrElement,
  getRandomArrElements,
};
