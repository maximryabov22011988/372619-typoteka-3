'use strict';

module.exports = {
  name: `--version`,
  run() {
    const {
      version
    } = require(`../../../package.json`);
    console.info(version);
  }
};
