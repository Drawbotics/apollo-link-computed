import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import urlJoin from 'url-join';

import { withClientState } from '../index';


export const GRAPHQL_HOST = 'http://localhost:5000';
export const GRAPHQL_BASEPATH = '/api/frontoffice/v1/graphql';


export function createClient(url, resolvers) {
  const TokenLink = () => setContext(() => {
    return {
      headers: {
        'Authorization': 'Token token=46gHtRijDv_K_n3aATjG',
      },
    };
  });


  const cache = new InMemoryCache();

  const link = ApolloLink.from([
    TokenLink(),
    withClientState({
      resolvers,
      cache,
    }),
    new HttpLink({
      uri: url,
      credentials: 'same-origin'
    }),
  ]);

  return new ApolloClient({ link, cache });
}
