'use strict';

const fs = require(`fs`).promises;
const http = require(`http`);
const chalk = require(`chalk`);

const {
  MOCK_FILENAME,
  HttpCode
} = require(`../../constants`);

const DEFAULT_PORT = 3000;

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Typoteka</title>
      </head>
      <body>
        ${message}
      </body>
    </html>
  `;

  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });
  res.end(template);
};


const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`: {
      try {
        const content = await fs.readFile(MOCK_FILENAME, `utf-8`);
        const publications = JSON.parse(content);
        const titles = publications.map(({title}) => `<li>${title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${titles}</ul>`);
      } catch (e) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }
      break;
    }
    default: {
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
    }
  }
};


module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, () => {
        console.info(chalk.green(`Waiting for connections on port ${port}`));
      })
      .on(`error`, ({message}) => {
        console.error(chalk.red(`Server creation error: ${message}`));
      });
  }
};
