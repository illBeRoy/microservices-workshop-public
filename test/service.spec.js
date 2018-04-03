import request from 'supertest';
import { Chance } from 'chance';
import { server } from '../src';
import { database } from '../src/database';

describe('Users Service', () => {
  it('should be working', async () => {
    const response = await request(server).get('/_health');
    expect(response.status).toEqual(200);
  });

  describe('must have features', () => {
    it('should not authenticate unknown users', async () => {
      const email = Chance().email();
      const password = validPassword();
      const response = await request(server).get('/authenticate').query({ email, password });
      expect(response.body).toBe(false);
    });

    it('should authenticate users that registered before if they have correct password', async () => {
      const email = Chance().email();
      const password = validPassword();

      await request(server).post('/register').send({ email, password });

      const response = await request(server).get('/authenticate').query({ email, password });
      expect(response.body).toBe(true);
    });

    it('should not authenticate users that registered before if they have incorrect password', async () => {
      const email = Chance().email();
      const password = validPassword();
      const notThePassword = validPassword();

      await request(server).post('/register').send({ email, password });

      const response = await request(server).get('/authenticate').query({ email, password: notThePassword });
      expect(response.body).toBe(false);
    });
  });

  describe('bonus features', () => {
    it('should not let another user register with same email', async () => {
      const email = Chance().email();
      const password = validPassword();
      const password2 = validPassword();

      await request(server).post('/register').send({ email, password });
      await request(server).post('/register').send({ email, password: password2 });

      const isUser1Authenticated = await request(server).get('/authenticate').query({ email, password });
      const isUser2Authenticated = await request(server).get('/authenticate').query({ email, password: password2 });

      expect(isUser1Authenticated.body).toBe(true);
      expect(isUser2Authenticated.body).toBe(false);
    });

    it('should not let user register if they use invalid email', async () => {
      const email = Chance().string();
      const password = validPassword();

      await request(server).post('/register').send({ email, password });

      const response = await request(server).get('/authenticate').query({ email, password });
      expect(response.body).toBe(false);
    });

    it('should not let user register if password is not 4-20 characters', async () => {
      const email = Chance().email();
      const password = invalidPassword();

      await request(server).post('/register').send({ email, password });

      const response = await request(server).get('/authenticate').query({ email, password });
      expect(response.body).toBe(false);
    });
  });

  afterEach(() =>
    database.empty());
});

const validPassword = () => Chance().string({ length: Chance().integer({min: 4, max: 20}) });
const invalidPassword = () => Chance().string({ length: Chance().pickone([Chance().integer({ min: 0, max: 3 }), Chance().integer({ min: 21, max: 1000 })]) });
