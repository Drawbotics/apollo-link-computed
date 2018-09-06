import React from 'react';
import { ApolloProvider, Query } from "react-apollo";
import gql from 'graphql-tag';
import urlJoin from 'url-join';
import dedent from 'dedent';

import { createClient, GRAPHQL_BASEPATH, GRAPHQL_HOST } from './apollo-client';
import Editors from './Editors';


function getResult(loading, data, error, graphqlError) {
  if (loading) {
    return 'Loading...';
  }
  if (error) {
    return error;
  }
  if (graphqlError) {
    return graphqlError.message;
  }
  if (data == null) {
    return '';
  }
  return JSON.stringify(data, null, 2);
}


class Example extends React.Component {
  state = {
    graphqlUrl: 'https://graphql-pokemon.now.sh/',
    resolvers: dedent`
      {
        Pokemon: {
          dependencies: {
            numberOfEvolutions: \`
              fragment _ on Pokemon {
                evolutions {
                  id
                }
              }
            \`
          },
          resolvers: {
            numberOfEvolutions: (pokemon) => {
              return pokemon.evolutions.length;
            },
          },
        },
        PokemonAttack: {
          withoutDependencies: () => 'No dependencies',
        },
      }
    `,
    query: dedent`
      {
        pokemon(name: "Pikachu") {
          id
          name
          numberOfEvolutions @client(type: Pokemon)
          attacks {
            withoutDependencies @client(type: PokemonAttack)
          }
        }
      }
    `,
  };
  render() {
    const { query, resolvers: resolversStr, graphqlUrl } = this.state;
    let resolvers;
    let error = null;
    try {
      resolvers = eval(`(${resolversStr})`);
    }
    catch (err) {
      resolvers = {};
      error = err.stack;
    }
    const client = createClient(graphqlUrl, resolvers);
    return (
      <ApolloProvider client={client}>
        <Query
          query={gql`${query}`}>
          {({ data, loading, error: graphqlError }) => (
            <Editors
              graphqlUrl={graphqlUrl}
              query={query}
              resolvers={resolversStr}
              result={getResult(loading, data, error, graphqlError)}
              onChangeUrl={(graphqlUrl) => this.setState({ graphqlUrl })}
              onChangeQuery={(query) => this.setState({ query })}
              onChangeResolvers={(resolvers) => this.setState({ resolvers })} />
          )}
        </Query>
      </ApolloProvider>
    );
  }
}


export default Example;
