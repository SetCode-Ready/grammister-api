const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const { authValidate } = require('../../utils/authValidate');

module.exports = {
	Query: {

		async findAllPosts() {
			try {
				const posts = await Post.find().sort({ createdAt: -1 });
				return posts;
			} catch (err) {
				throw new Error(err);
			}
		},

		async findPostById(_, { postId }) {
			try {
				const post = await Post.findById(postId);
				
				if (!post) {
					throw new Error('Post not found');
				}

				return post;
			} catch (err) {
				throw new Error(err);
			}
		}

	},

	Mutation: {

		async createPost(_, { body }, context) {
			const user = authValidate(context);

			if (body.trim() === '') {
				throw new Error('Post body must not be empty');
			}

			const newPost = new Post({
				body,
				user: user.id,
				username: user.username,
				email: user.email,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			});

			const post = await newPost.save();

			context.pubsub.publish('NEW_POST', {
				newPost: post
			})

			return post;
		},

		async deletePost(_, { postId }, context) {
			const user = authValidate(context);

			try {
				const post = await Post.findById(postId);

				if (!post) {
					throw new UserInputError("Post not found.");
				}

				if (user.email !== post.email) {
					throw new AuthenticationError("Action not allowed.");
				}

				await post.delete();

				return 'Post deleted successfuly.';

			} catch (err) {
				throw new Error(err.message);
			}
		},

		async likePost(_, { postId }, context) {
			const { username, email } = authValidate(context);

			const post = await Post.findById(postId);

			if (!post) {
				throw new UserInputError("Post not found");
			}

			if (post.likes.find(like => like.email === email)) {
				post.likes = post.likes.filter(like => like.email !== email);
			} else {
				post.likes.push({
					username,
					email,
					createdAt: new Date().toISOString(),
				});
			}

			await post.save();

			return post;
		},

	},

	Subscription: {
		newPost: {
			subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST'),
		}
	}
};