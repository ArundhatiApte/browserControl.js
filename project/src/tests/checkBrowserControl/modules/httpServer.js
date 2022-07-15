"use strict";

const http = require("http");
const promisify = require("util").promisify;

const getPageByUrl = function(urlToPage, url) {
  for (const [shortUrl, htmlOfPage] of Object.entries(urlToPage)) {
    if (url.indexOf(shortUrl) !== -1) {
      return htmlOfPage;
    }
  }
  return null;
};

const writeSuccesHeaderOfResponse = function(response) {
  return response.writeHead(200, { "Content-Type": "text/html" });
};

const server = http.createServer(function(request, response) {
  const url = request.url.slice(1); //без / вначале
  const pageToSend = getPageByUrl(serverData.urlToPage, url);

  if (pageToSend) {
    writeSuccesHeaderOfResponse(response);
    response.write(pageToSend);
  }
  else if (serverData.xhrRequest.url.indexOf(url) !== -1) {
    writeSuccesHeaderOfResponse(response);
    serverData.xhrRequest.count += 1;
    response.write(serverData.xhrRequest.count.toString());
  }
  else {
    response.write("404 not found");
  }
  response.end();
});

server.listenAsync = function(port) {
  return new Promise((resolve) => {
    return this.listen(port, () => {
      this.port = port;
      resolve();
    });
  });
};

const createPageHTML = function(bodyContent) {
  return "<html>" +
    "<head lang=\"ru\"" +
      "<meta http-equiv='Content-Type' content='charset utf8'></meta>" +
    "</head>" +
    "<body>" +
      bodyContent +
    "</body>" +
  "</html>";
};

const serverData = {
  urlToPage: {
    "home": createPageHTML("<h1>Абвгдеёжз...<h1>"),
    "about": createPageHTML("<p>Lorem Ipsum<p>")
  },
  xhrRequest: {
    url: "/inc/",
    count: 0
  }
};

server.urlToPage = serverData.urlToPage;
server.xhrRequest = serverData.xhrRequest;

module.exports = server;
