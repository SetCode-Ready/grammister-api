const postResolvers = require('./postResolvers');
const userResolvers = require('./userResolvers');
// import commentsResolvers from './comments';

module.exports = {
//   Post: {
//     likeCount: (parent) => parent.likes.length,
//     commentCount: (parent) => parent.comments.length
//   },
  Query: {
    ...postResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    // ...commentsResolvers.Mutation
  },
  // Subscription: {
  //   ...postResolvers.Subscription
  // }
};