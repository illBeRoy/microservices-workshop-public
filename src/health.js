import { Router } from 'express';

export const health = () =>
  Router()
    .get('/_health', (req, res) =>
      res.status(200).send({ status: 'ok' }));
