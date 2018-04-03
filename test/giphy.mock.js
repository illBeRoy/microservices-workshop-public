import nock from 'nock';
import { Chance } from 'chance';

class GiphyServer {
  constructor() {
    this._trending = { data: [] };
    this._search = { data: [] };
    this._scopes = [];
  }

  trending() {
    return this._trending;
  }

  search() {
    return this._search;
  }

  serveTrending(uri = '/v1/gifs/trending') {
    this._trending = buildResponse();
    this._scopes.push(
      nock('https://api.giphy.com')
        .get(uri)
        .query(queryString =>
          queryString.api_key === 'epGwHCtEzxTDLJ4L3XOfBggbRrEhYlop')
        .reply(200, this._trending)
    );
  }

  serveSearchForQuery(query, uri = '/v1/gifs/search') {
    this._search = buildResponse();
    this._scopes.push(
      nock('https://api.giphy.com')
        .get(uri)
        .query(queryString =>
          queryString.api_key === 'epGwHCtEzxTDLJ4L3XOfBggbRrEhYlop' &&
          queryString.q === query)
        .reply(200, this._search)
    );
  }

  done() {
    this._scopes.forEach(scope => scope.done());
  }
}

const buildResponse = () => {
  const amountOfItems = Chance().integer({ min: 0, max: 20 });
  const response = { data: [] };
  for (let i = 0; i < amountOfItems; i += 1) {
    response.data.push(buildResponseItem());
  }
  return response;
};

const buildResponseItem = () =>
  ({
    type: 'gif',
    images: {
      preview_gif: {
        url: Chance().url()
      },
      original: {
        url: Chance().url()
      }
    }
  });

export { GiphyServer };
