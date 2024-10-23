import { gql } from "@apollo/react-hooks";

export const LoginMutation = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      status
      token
      refreshToken
    }
  }
`;

export const RefreshTokenMutation = gql`
  mutation RefreshToken($accessToken: String!) {
    refreshToken(accessToken: $accessToken) {
      status
      token
      refreshToken
    }
  }
`;

export const RegisterMutation = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      userName
      email
      id
    }
  }
`;
