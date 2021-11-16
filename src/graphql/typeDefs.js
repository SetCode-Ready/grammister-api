const { gql } = require('apollo-server');

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    email: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  type Comment {
    id: ID!
    body: String!
    username: String!
    email: String!
    createdAt: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    username: String!
    email: String!
  }

  type User {
    id: ID!
    email: String!
    token: String!
    name: String!
    createdAt: String!
    followers: [ID]
    following: [ID]
  }

  type UserResponse {
    id: ID!
    email: String!
    name: String!
    createdAt: String!
    followers: [ID]
    following: [ID]
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    birthDate: String!,
    gender: String
  }

  type Query {
    findAllUsers: [UserResponse]
    findUserById(userId: ID!): UserResponse
    findAllPosts: [Post]
    findPostById(postId: ID!): Post
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    followUser(userId: ID!): String!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }

  type Subscription {
    newPost: Post!
  }
`;