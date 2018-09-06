import mergeWith from 'lodash/mergeWith';
import fclone from 'fclone';


function normalizeResolvers(resolvers) {
  if (resolvers.dependencies != null && typeof resolvers.dependencies !== 'function') {
    return resolvers;
  }
  return {
    dependencies: {},
    resolvers,
  };
}


export default function mergeResolvers(...resolvers) {
  return resolvers.reduce((memo, resolvers) => {
    Object.keys(resolvers).forEach((type) => {
      const typeResolvers = fclone(normalizeResolvers(resolvers[type]));
      if (memo[type] != null) {
        mergeWith(memo[type].dependencies, typeResolvers.dependencies, (objValue, srcValue, key, object) => {
          if (object.hasOwnProperty(key)) {  // Duplicated resolver function
            throw new Error(`Duplicated key "${key}" found when merging resolvers for type "${type}"`);
          }
        });
        mergeWith(memo[type].resolvers, typeResolvers.resolvers, (objValue, srcValue, key, object) => {
          if (object.hasOwnProperty(key)) {  // Duplicated resolver function
            throw new Error(`Duplicated key "${key}" found when merging resolvers for type "${type}"`);
          }
        });
      }
      else {
        memo[type] = typeResolvers;
      }
    });
    return memo;
  }, {});
}
