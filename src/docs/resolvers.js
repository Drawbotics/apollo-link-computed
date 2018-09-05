export default {
  Estate: {
    dependencies: {
      myCustom: `
        fragment _ on Estate {
          id
          projectType
        }
      `,
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
};
