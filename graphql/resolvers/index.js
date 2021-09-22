const postsResolvers = require("./post");
const userResolvers = require("./user");

module.exports = {
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};
