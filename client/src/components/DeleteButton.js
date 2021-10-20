import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Button, Icon, Confirm } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../util/grapql";

const DeleteButton = ({ postId, callback, commentId }) => {
  const [confirmOpen, setConfrimOpen] = useState(false);
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation, { error }] = useMutation(mutation, {
    async update(proxy) {
      if (!commentId) {
        setConfrimOpen(false);

        const data = await proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });

        let newData = data.getPosts.filter((p) => p.id !== postId);

        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: newData,
          },
        });
      }
      if (callback) callback();
    },

    onError(error) {
      // console.log(error)
    },

    variables: {
      postId,
      commentId,
    },
  });
  return (
    <>
      <Button
        as="div"
        color="red"
        onClick={() => setConfrimOpen(true)}
        floated="right"
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfrimOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;
export default DeleteButton;
