'use strict';

const fs = require(`fs`).promises;
const {MOCK_FILENAME} = require(`../../constants`);

let mockData = [];

const getMockData = async () => {
  if (mockData.length) {
    return mockData;
  }

  try {
    const fileContent = await fs.readFile(`./${MOCK_FILENAME}`);
    mockData = JSON.parse(fileContent);
  } catch (err) {
    console.log(err);
    return err;
  }

  return mockData;
};

module.exports = getMockData;

