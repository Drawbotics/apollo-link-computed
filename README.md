# Apollo Link Computed

With `apollo-link-computed` it's possible to have computed properties in GraphQL results in a predictable way. This behaves like an extension to [apollo-link-state](https://github.com/apollographql/apollo-link-state) to the point that it's totally compatible with it.

This library allows you to create local attributes in your GraphQL results in the same way as with [apollo-link-state](https://github.com/apollographql/apollo-link-state) but making sure you have all the data necessary for it. Basically, it solves the following problem:

```javascript
// resolvers.js
{
  Pokemon: {
    numberOfEvolutions: (pokemon) => {
      // how can we be sure we asked for evolutions?
      return pokemon.evolutions.length;
    },
  },
}

// MyComponent.jsx
class MyComponent extends React.Component {
  // ...
  render() {
    return (
      // ...
      <Query
        query={gql`
          query {
            pokemon {
              id
              numberOfEvolutions @client
            }
          }
        `}>
        {/* ... */}
      </Query>
      // ...
    );
  }
  // ...
}
```

In the example above, the query is gonna fail because we're not asking for `evolutions`. Our only option would be to also ask for the evolutions even tho our component doesn't care about them, it only wants `numberOfEvolutions`. As can be imagined, with more complex properties, the final components need to know more and more about the required data.


## Installation and usage

Install the library as any other npm package:

```bash
$ npm i apollo-link-computed
```

Then, if you already have [Apollo Client set up](https://www.apollographql.com/docs/react/advanced/boost-migration.html), you can add it as usual:

```javascript
// ... other apollo dependencies ...
import { withClientState } from 'apollo-link-computed';
import resolvers from './resolvers';  // Resolvers is where you define your local and computed properties

// This is the same cache you'll pass into ApolloClient
const cache = new InMemoryCache(/* ... */);

// It takes the same arguments as apollo-link-state
const stateLink = withClientState({
  cache,
  resolvers,
});
```

Now, in our resolvers file we define our local and computed properties, for example:

```javascript
export default {
  Pokemon: {
    // This is how we can be sure our computed properties have
    // all the data that we need, we define the requirements of it.
    dependencies: {
      numberOfEvolutions: `
        fragment _ on Pokemon {
          evolutions {
            id
          }
        }
      `,
    },
    resolvers: {
      numberOfEvolutions: (pokemon) => {
        return pokemon.evolutions.length;
      },
    },
  },
  PokemonAttack: {
    localProperty: () => {
      // We can also define resolvers with no dependencies that are
      // fully compatible with apollo-link-state
      return 'Hello World!';
    },
  },
};
```

The final thing is using our computed properties in our components:

```javascript
class MyComponent extends React.Component {
  // ...
  render() {
    return (
      // ...
      <Query
        query={gql`
          query {
            pokemon {
              id
              numberOfEvolutions @client(type: Pokemon)
              attacks {
                localProperty @client(type: PokemonAttack)
              }
            }
          }
        `}>
        {/*
          We can be sure data is gonna contain only the numberOfEvolutions
          as if it was a native property.
        */}
      </Query>
      // ...
    );
  }
  // ...
}
```

## Contributing

Everyone is welcome to contribute with issues, feature requests or pull requests.

## License

[MIT](LICENSE)
