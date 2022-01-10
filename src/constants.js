'use strict';

const DEFAULT_COMMAND = `--help`;

// 3ий аргумент process.argv[2]
const USER_ARGV_INDEX = 2;

const MOCK_FILENAME = `mocks.json`;

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1
};

const HttpCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};


module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MOCK_FILENAME,
  ExitCode,
  HttpCode
};
