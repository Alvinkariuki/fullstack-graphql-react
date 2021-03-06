const { UserInputError, AuthenticationError } = require("apollo-server-errors");
const Post = require("../../models/Post");
const checkAuth = require("../../util/checkAuth");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, ctx) => {
      const { username } = checkAuth(ctx);
      if (body.trim() === "")
        throw new UserInputError("Empty comment", {
          errors: { body: "Comment body must not be empty" },
        });

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });

        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },

    deleteComment: async (_, { postId, commentId }, ctx) => {
      const { username } = checkAuth(ctx);

      const post = await Post.findById(postId);

      if (post) {
        const commentIdx = post.comments.findIndex(
          (comment) => comment.id === commentId
        );

        if (post.comments[commentIdx].username === username) {
          post.comments.splice(commentIdx, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Post not found");
      }
    },

    likePost: async (_, { postId }, ctx) => {
      const { username } = checkAuth(ctx);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          // Post already liked, unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          // Not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    },
  },
};
