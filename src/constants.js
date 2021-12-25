'use strict';

const DEFAULT_COMMAND = `--help`;

// 3ий аргумент process.argv[2]
const USER_ARGV_INDEX = 2;

const MOCK_FILENAME = `mocks.json`;

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MOCK_FILENAME,
  ExitCode
};
