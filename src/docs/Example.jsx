import React from 'react';
import { ApolloProvider, Query } from "react-apollo";
import gql from 'graphql-tag';
import urlJoin from 'url-join';
import dedent from 'dedent';

import { createClient, GRAPHQL_BASEPATH, GRAPHQL_HOST } from './apollo-client';
import Editor from './Editor';


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
          number
          name
          numberOfEvolutions @client(type: Pokemon)
          attacks {
            withoutDependencies @client(type: PokemonAttack)
            special {
              name
              type
              damage
            }
          }
        }
      }
    `,
  };
  render() {
    const { query, resolvers: resolversStr, graphqlUrl } = this.state;
    const resolvers = eval(`(${resolversStr})`);
    const client = createClient(graphqlUrl, resolvers);
    return (
      <ApolloProvider client={client}>
        <Query
          query={gql`${query}`}>
          {({ data, loading }) => (
            <Editor
              graphqlUrl={graphqlUrl}
              query={query}
              resolvers={resolversStr}
              result={loading ? 'Loading' : JSON.stringify(data, null, 2)}
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
