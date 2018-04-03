import request from 'supertest';
import { Chance } from 'chance';
import { server } from '../src';
import { database } from '../src/database';

describe('Posts Service', () => {
  it('should be working', async () => {
    const response = await request(server).get('/_health');
    expect(response.status).toEqual(200);
  });

  describe('must have features', () => {
    it('should list all posts', async () => {
      const posts = makeMultiplePosts();
      for (const post of posts) {
        await request(server).post('/post').send(post);
      }

      const response = await request(server).get('/feed');
      posts.forEach(post =>
        expect(response.body).toContainEqual(post));
    });

    it('should show you only posts which contain the search term when searching', async () => {
      const posts = makeMultiplePosts();
      for (const post of posts) {
        await request(server).post('/post').send(post);
      }
      const term = Chance().word({length: 3});

      const response = await request(server).get('/search').query({ term });
      posts
        .filter(post => post.text.indexOf(term) >= 0)
        .forEach(post =>
          expect(response.body).toContainEqual(post));
      posts
        .filter(post => post.text.toLowerCase().indexOf(term.toLowerCase()) < 0)
        .forEach(post =>
          expect(response.body).not.toContainEqual(post));
    });
  });

  describe('bonus features', () => {
    it('should not add post to feed if email is missing', async () => {
      const post = makePost();
      delete post.email;
      await request(server).post('/post').send(post);

      const response = await request(server).get('/feed');
      expect(response.body).not.toContainEqual(post);
    });

    it('should not add post to feed if text is not between 4 and 140 characters', async () => {
      const post = makePost();
      post.text = Chance().string({length: Chance().pickone([Chance().integer({min: 0, max: 3}), Chance().integer({min: 141, max: 1000})])})
      await request(server).post('/post').send(post);

      const response = await request(server).get('/feed');
      expect(response.body).not.toContainEqual(post);
    });

    it('should order the posts by posting order, most recent should be first', async () => {
      const posts = makeMultiplePosts();
      for (const post of posts) {
        await request(server).post('/post').send(post);
      }
      const term = posts[0].text.toLowerCase();

      const response = await request(server).get('/feed').query({ term });
      expect(response.body).toEqual(posts.reverse());
    });

    it('should support case-insensitive search', async () => {
      const posts = makeMultiplePosts();
      for (const post of posts) {
        await request(server).post('/post').send(post);
      }
      const term = posts[0].text.toLowerCase();

      const response = await request(server).get('/search').query({ term });
      posts
        .filter(post => post.text.toLowerCase().indexOf(term.toLowerCase()) >= 0)
        .forEach(post =>
          expect(response.body).toContainEqual(post));
    });
  });

  afterEach(() =>
    database.empty());
});

const makePost = () =>
  ({
    email: Chance().email(),
    text: Chance().paragraph().substr(0, 140),
    image: Chance().pickone([null, Chance().url()])
  });

const makeMultiplePosts = () => {
  const numberOfPosts = Chance().integer({min: 0, max: 100});
  const posts = [];
  for (let i = 0; i < numberOfPosts; i += 1) {
    posts.push(makePost());
  }
  return posts;
};
