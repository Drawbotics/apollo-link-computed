import { checkDocument, removeDirectivesFromDocument } from 'apollo-utilities';
import cloneDeep from 'fclone';
import gql from 'fraql';


const removedCache = new Map();


function addDependenciesToSelectionSet(selectionSet, dependencies) {
  const extraSelections = [];
  selectionSet.selections.forEach((selection) => {
    if (selection == null || selection.kind !== 'Field' || selection.directives == null) {
      return;
    }

    const clientDirective = selection.directives.find((directive) => {
      return directive.name.value === 'client';
    });

    if (clientDirective == null) {
      return;
    }

    const typeArg = clientDirective.arguments.find((arg) => arg.name.value === 'type');

    if ( ! typeArg) {
      return;
    }

    const type = typeArg.value.value;
    const selectionName = selection.name.value;
    const directiveDependencies = dependencies
      && dependencies[type]
      && dependencies[type][selectionName] || null;

    if (directiveDependencies == null) {
      return;
    }

    const dependenciesFragmentDoc = gql`${directiveDependencies}`;
    const dependenciesFragment = dependenciesFragmentDoc.definitions[0];
    delete dependenciesFragment.name;
    extraSelections.push(dependenciesFragment);
  });

  selectionSet.selections.forEach((selection) => {
    const { kind } = selection;
    if ((kind === 'Field' || kind === 'InlineFragment') && selection.selectionSet != null) {
      addDependenciesToSelectionSet(selection.selectionSet, dependencies);
    }
  });

  selectionSet.selections = [ ...selectionSet.selections, ...extraSelections ];
}


export function addDependenciesToDocument(doc, dependencies) {
  const docClone = cloneDeep(doc);
  const { definitions } = docClone;

  definitions.forEach(({ selectionSet }) => {
    addDependenciesToSelectionSet(selectionSet, dependencies);
  });

  return docClone;
}


export function removeClientSetsFromDocument(query) {
  // caching
  const cached = removedCache.get(query);
  if (cached) {
    return cached;
  }

  checkDocument(query);
  const docClone = removeDirectivesFromDocument([
    {
      remove: true,
      test: (directive) => directive.name.value === 'client',
    },
  ], query);

  removedCache.set(query, docClone);
  return docClone;
}


export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export function extractResolversAndDependencies(resolversAndDeps) {
  const result = Object.keys(resolversAndDeps).reduce((memo, typeName) => {
    const { resolvers, dependencies } = resolversAndDeps[typeName];
    if (dependencies == null || typeof dependencies === 'function') {
      return {
        resolvers: {
          ...memo.resolvers,
          [typeName]: resolversAndDeps[typeName],
        },
        dependencies: {
          ...memo.dependencies,
          [typeName]: {},
        },
      };
    }
    return {
      resolvers: {
        ...memo.resolvers,
        [typeName]: resolvers,
      },
      dependencies: {
        ...memo.dependencies,
        [typeName]: dependencies,
      },
    };
  }, {});
  return result;
}
