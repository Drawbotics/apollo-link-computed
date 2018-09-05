import React from 'react';
import { ApolloProvider, Query } from "react-apollo";
import gql from 'graphql-tag';
import urlJoin from 'url-join';
import dedent from 'dedent';

import { createClient, GRAPHQL_BASEPATH, GRAPHQL_HOST } from './apollo-client';
import Editor from './Editor';


class Example extends React.Component {
  state = {
    graphqlUrl: urlJoin(GRAPHQL_HOST, GRAPHQL_BASEPATH),
    resolvers: dedent`
      {
        Estate: {
          dependencies: {
            myCustom: \`
              fragment _ on Estate {
                id
                projectType
              }
            \`,
          },
          resolvers: {
            myCustom: (estate) => {
              return estate.projectType;
            },
          },
        },
        Item: {
          directField: (item) => {
            return 'Without';
          },
        },
      }
    `,
    query: dedent`
      query Estate {
        estate(id: 1234) {
          id
          myCustom @client(type: Estate)
          items {
            id
            directField @client(type: Item)
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
