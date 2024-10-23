import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { lazy } from "react";

const token = localStorage.getItem("accessToken");
const httpLink = new HttpLink({
  uri: "http://localhost:3010/graphql",
});

const wsLink = new WebSocketLink(
  new SubscriptionClient("ws://localhost:3010/graphql", {
    reconnect: true,
    timeout: 30000,
    lazy: true,
    connectionParams: {
      authToken: "Bearer " + token,
    },
  })
);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpAuthLink = ApolloLink.from([authLink, httpLink]);

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpAuthLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

export default client;
