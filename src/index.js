import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { health } from './health';
import { logger } from './logger';
import { database } from './database';

export const server =
  express()
    .use(cors())
    .use(json())
    .use(health())
    .use(logger())

    .post('/register', (req, res) => {
      // should register users in the database.
      // request body is json and looks like this:
      // { "email": "example@email.com", "password": "somepassword" }
      res.send();
    })

    .get('/authenticate', (req, res) => {
      // gets email and password in url, and sends back "true" or "false" if it verifies that there is such
      // user with such password.
      // example: http://localhost:3000/authenticate?email=example@email.com&password=somepassword
      res.send();
    });

if (module === require.main) {
  server.listen(3000);
}
