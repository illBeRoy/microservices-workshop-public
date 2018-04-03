import request from 'supertest';
import { Chance } from 'chance';
import { server } from '../src';
import { GiphyServer } from './giphy.mock';

describe('Images Service', () => {
  let giphyApi;

  beforeEach(() =>
    giphyApi = new GiphyServer());

  it('should be working', async () => {
    const response = await request(server).get('/_health');
    expect(response.status).toEqual(200);
  });

  describe('must have features', () => {
    it('should serve all trending items correctly', async () => {
      giphyApi.serveTrending();

      const response = await request(server).get('/trending');
      expect(response.body.length).toEqual(giphyApi.trending().data.length);
      response.body.forEach(
        item =>
          expect(
            giphyApi
              .trending()
              .data
              .map(item =>
                ({ preview: item.images.preview_gif.url, original: item.images.original.url })))
            .toContainEqual(item));
    });
  });

  describe('bonus features', () => {
    it('should allow searching gifs by query', async () => {
      const searchQuery = Chance().string();
      giphyApi.serveSearchForQuery(searchQuery);

      const response = await request(server).get(`/search?query=${encodeURIComponent(searchQuery)}`);
      expect(response.body.length).toEqual(giphyApi.search().data.length);
      response.body.forEach(
        item =>
          expect(
            giphyApi
              .search()
              .data
              .map(item =>
                ({ preview: item.images.preview_gif.url, original: item.images.original.url })))
            .toContainEqual(item));
    })
  });

  afterEach(() =>
    giphyApi.done());
});

const validPassword = () => Chance().string({ length: Chance().integer({min: 4, max: 20}) });
const invalidPassword = () => Chance().string({ length: Chance().pickone([Chance().integer({ min: 0, max: 3 }), Chance().integer({ min: 21, max: 1000 })]) });
