import { ApolloLink, Observable } from 'apollo-link';
import { hasDirectives, getMainDefinition } from 'apollo-utilities';
import * as Async from 'graphql-anywhere/lib/async';

import {
  removeClientSetsFromDocument,
  capitalizeFirstLetter,
  extractResolversAndDependencies,
  addDependenciesToDocument,
  normalizeTypeDefs,
} from './utils';


const { graphql } = Async;


function createResolver(query, resolvers, defaults) {
  return (fieldName, rootValue = {}, args, context, info) => {
    const { resultKey } = info;
    const type = capitalizeFirstLetter(getMainDefinition(query).operation) || 'Query';

    const aliasedNode = rootValue[resultKey];
    const preAliasingNode = rootValue[fieldName];
    const aliasNeeded = resultKey !== fieldName;

    // If aliasedValue is defined, some other link or serverQuery already returned a value
    if (aliasedNode !== undefined || preAliasingNode !== undefined) {
      return aliasedNode || preAliasingNode;
    }

    // Look for the field in the custom resolver map
    const resolverMap = resolvers[rootValue.__typename || type];
    if (resolverMap) {
      const resolve = resolverMap[fieldName];
      if (resolve) {
        return resolve(rootValue, args, context, info);
      }
    }

    return ((aliasNeeded ? aliasedNode : preAliasingNode) || (defaults || {})[fieldName]);
  };
}


export function withClientState(clientStateConfig = { resolvers: {}, defaults: {} }) {
  const { resolvers: resolversAndDeps, defaults, cache, typeDefs, fragmentMatcher } = clientStateConfig;

  if (cache && defaults) {
    cache.writeData({ data: defaults });
  }

  class ComputedLink extends ApolloLink {

    writeDefaults() {
      if (cache && defaults) {
        cache.writeData({ data: defaults });
      }
    }

    request(operation, forward) {
      forward = forward != null ? forward : () => Observable.of({ data: {} });
      let { query } = operation;

      if (typeDefs) {
        const directives = 'directive @client on FIELD';
        const definition = normalizeTypeDefs(typeDefs);

        operation.setContext(({ schemas = [] }) => ({
          schemas: schemas.concat([{ definition, directives }]),
        }));
      }

      if ( ! hasDirectives(['client'], query)) {
        return forward(operation);
      }

      const { resolvers, dependencies } = extractResolversAndDependencies(resolversAndDeps);

      query = addDependenciesToDocument(query, dependencies);
      const serverQuery = removeClientSetsFromDocument(query);
      const resolver = createResolver(query, resolvers, defaults);

      if (serverQuery) {
        operation.query = serverQuery;
      }

      const obs = serverQuery && forward ? forward(operation) : Observable.of({ data: {} });

      return new Observable((observer) => {
        let complete = false;
        let handlingNext = false;

        obs.subscribe({
          next: ({ data, errors }) => {
            const observerErrorHandler = observer.error.bind(observer);
            const context = operation.getContext();
            handlingNext = true;
            //data is from the server and provides the root value to this GraphQL resolution
            //when there is no resolver, the data is taken from the context
            graphql(resolver, query, data, context, operation.variables, { fragmentMatcher })
              .then((nextData) => {
                observer.next({ data: nextData, errors });
                if (complete) {
                  observer.complete();
                }
                handlingNext = false;
              })
              .catch(observerErrorHandler);
          },
          error: observer.error.bind(observer),
          complete: () => {
            if ( ! handlingNext) {
              observer.complete();
            }
            complete = true;
          },
        });
      });
    }
  }

  return new ComputedLink();
}

export mergeResolvers from './merge-resolvers';
