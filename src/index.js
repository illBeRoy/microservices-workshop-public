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

    .post('/post', (req, res) => {
      /**
       * Receives { text, email, image } as body and posts it to feed. Not expected to return anything meaningful.
       * Can assume that text and email exist and valid, but image may not be there.
       * If doing the bonus, this should also verify that email exists and that message is 4-140 characters.
       * Not expected to return any meaningful content.
       */
      res.send();
    })

    .get('/feed', (req, res) => {
      /**
       * Simply returns all the posts in the database as a JSON array.
       * Each post should look like: { text: string, email: string, image: string || null }
       * If doing the bonus it should return them ordered from most recent to the oldest.
       */
      res.send([]);
    })

    .get('/search', (req, res) => {
      /**
       * Expects a query string parameter called "term" and returns a feed of only the posts which contain that
       * term in their "text" property. (example: `/search?term=dog`)
       * If doing the bonus, it should do the search in a case-insensitive manner.
       */
      res.send([]);
    });

if (module === require.main) {
  server.listen(3001);
}
