import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Button, Icon, Confirm } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../util/grapql";

const DeleteButton = ({ postId, callback }) => {
  const [confirmOpen, setConfrimOpen] = useState(false);
  const [deletePost, { error }] = useMutation(DELETE_POST_MUTATION, {
    async update(proxy) {
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
      if (callback) callback();
    },

    onError(error) {
      // console.log(error)
    },

    variables: {
      postId,
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
        onConfirm={deletePost}
      />
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
export default DeleteButton;
