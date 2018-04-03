import nodeFetch from 'node-fetch';
import { URL } from 'url';

const fetchWithAppropriateQueryString = (url, options) => {
  const urlObject = new URL(url);
  urlObject.searchParams.set('api_key', 'epGwHCtEzxTDLJ4L3XOfBggbRrEhYlop');
  return nodeFetch(urlObject.href, options);
};

export { fetchWithAppropriateQueryString as fetch };
