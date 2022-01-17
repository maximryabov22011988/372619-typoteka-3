'use strict';

const chalk = require(`chalk`);

module.exports = {
  name: `--version`,
  run() {
    const {version} = require(`../../../package.json`);
    console.info(chalk.blue(version));
  }
};
