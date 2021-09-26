const { UserInputError, AuthenticationError } = require('apollo-server-errors');
const Post = require('../../models/Post');
const { authValidate } = require('../../utils/authValidate');

module.exports = {
    Mutation: {
        async createComment (_, { postId, body }, context) {
            const { username, email } = authValidate(context);

            if (body.trim === "") {
                throw new UserInputError("Empty comment", {
                    errors: {
                        body: "Comment body must not empty",
                    }
                });
            }

            const post = await Post.findById(postId);

            if (!post) {
                throw new UserInputError("Post not found");
            }

            const comment = {
                body,
                username,
                email,
                createdAt: new Date().toISOString(),
            }

            post.comments.unshift(comment);

            await post.save();

            return post;
        },

        async deleteComment(_, { postId, commentId }, context) {
            const { email } = authValidate(context);

            const post = await Post.findById(postId);

            if (!post) {
                throw new UserInputError("Post not found");
            }

            const commentIndex = post.comments.findIndex(comment => comment.id === commentId);

            if (post.comments[commentIndex].email !== email) {
                throw new AuthenticationError("Action not allowed");
            }

            post.comments.splice(commentIndex, 1);

            await post.save();

            return post;
        }
    }
};