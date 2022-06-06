'use strict';

const {Server} = require(`socket.io`);
const {DEFAULT_FRONT_PORT} = require(`../../constants`);

module.exports = (server) =>
  new Server(server, {
    cors: {
      origins: [`localhost:${DEFAULT_FRONT_PORT}`],
      methods: [`GET`]
    }
  });
