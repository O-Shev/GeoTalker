const http = require('http');

class ApiServer {
  #t_client;
  #CONFIG;

  constructor(t_client, S_CONFIG) {
      this.#t_client = t_client;
      this.#CONFIG = S_CONFIG;

      this.server = http.createServer(this.#handleRequest.bind(this));
  }

  #handleRequest(req, res) {
    res.setHeader('Content-Type', 'application/json');
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    const method = req.method;

    const requestId = this.#t_client.getNextRequestId()


    if (method === 'POST'){
      this.#t_client.eventEmitter.once(requestId, (response) => {
        res.end(JSON.stringify(response));
      });

      let body = '';
      let parsedBody;

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        // Parse the body if it contains JSON
        try {
          parsedBody = JSON.parse(body);
        } catch (error) {
          console.error('Error parsing JSON:', error.message);
          res.end(JSON.stringify({ error: 'Invalid JSON', message: error.message}));
          return;
        }
        parsedBody['@extra'] = requestId;
        this.#t_client.tdSend(parsedBody);
        console.log('Api query received:', parsedBody);
      });

    }
  }

  start() {
      this.server.listen(this.#CONFIG.port, () => {
          console.log(`Server is listening at port:${this.#CONFIG.port}`);
      });
  }
}

module.exports = ApiServer;

// const queryParams = Object.fromEntries(url.searchParams.entries());
// if (method === 'GET' && path === '/t') {
//   this.#t_client.eventEmitter.once(requestId, (response) => {
//     res.end(JSON.stringify(response));
//   });
//
//   const queryObject = {};
//   for (const key in queryParams) {
//     if (queryParams.hasOwnProperty(key)) {
//       if (queryParams[key].toLowerCase() === 'true' || queryParams[key].toLowerCase() === 'false') {
//         queryObject[key] = queryParams[key].toLowerCase() === 'true';
//       } else {
//         queryObject[key] = queryParams[key];
//       }
//     }
//   }
//   queryObject['@extra'] = requestId;
//   this.#t_client.tdSend(queryObject);
// }

