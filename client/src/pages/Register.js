import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useForm } from "../util/hooks";
import { AuthContext } from "../context/auth";

const Register = (props) => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { handleChange, handleSubmit, formData } = useForm(registerUser, {
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: formData,
  });

  function registerUser() {
    addUser();
  }

  return (
    <div className="form-container">
      <Form
        onSubmit={handleSubmit}
        noValidate
        className={loading ? "loading" : ""}
      >
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          value={formData.username}
          error={errors.username ? true : false}
          onChange={handleChange}
        />

        <Form.Input
          label="Email"
          placeholder="Email.."
          name="email"
          value={formData.email}
          error={errors.email ? true : false}
          onChange={handleChange}
        />

        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={formData.password}
          error={errors.password ? true : false}
          onChange={handleChange}
        />

        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password.."
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={handleChange}
        />

        <Button type="submit" primary>
          Register
        </Button>
      </Form>

      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
