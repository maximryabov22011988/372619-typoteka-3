'use strict';

const help = require(`./help`);
const version = require(`./version`);
const filldb = require(`./filldb`);
const fill = require(`./fill`);
const server = require(`./server`);

const Cli = [help, version, filldb, fill, server].reduce((result, module) => {
  result[module.name] = module;
  return result;
}, {});

module.exports = Cli;
