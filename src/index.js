import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { health } from './health';
import { logger } from './logger';
import { fetch } from './fetch';

export const server =
  express()
    .use(cors())
    .use(json())
    .use(health())
    .use(logger())

    .get('/trending', async (req, res) => {
      /**
       * Should return a list of trending gifs from giphy. Read about /v1/gifs/trending.
       * The returned object should be an array consisting of objects which look like the following:
       * [{ preview: "URL OF PREVIEW GIF", original: "URL OF ORIGINAL GIF" }]
       */
      res.send([]);
    })

    .get('/search', async (req, res) => {
      /**
       * THIS IS AN OPTIONAL FEATURE.
       * Should accept a query string paremetr called "query" and return a list of gifs from giphy that match
       * the criteria. Read about /v1/gifs/search.
       * The returned object should be an array consisting of objects which look like the following:
       * [{ preview: "URL OF PREVIEW GIF", original: "URL OF ORIGINAL GIF" }].
       */
      res.send([]);
    });

if (module === require.main) {
  server.listen(3002);
}
