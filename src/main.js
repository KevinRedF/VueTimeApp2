import { createApp } from "vue";
import App from "./App.vue";
import { Quasar } from "quasar";
import quasarUserOptions from "./quasar-user-options";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { createApolloProvider } from "@vue/apollo-option";
import { createRouter, createWebHistory } from "vue-router";
import MainPage from "./components/MainPage.vue";
import Login from "./components/Login.vue";
import Statistics from "./components/Statistics.vue";

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  cache,
  uri: "https://time-tracker-wt.hasura.app/v1/graphql",
  headers: {
    "x-hasura-admin-secret":
      "DFmh1K1JxlaZiiTUHyPP6FVG0sDn15tPlZnQ6qUwpRt8AnEWkIjFhXQUsFFJAsBy",
  },
});

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/:catchAll(.*)", redirect: "/login" },
    {
      path: "/home/:user",
      name: "home",
      component: MainPage,
      props: (route) => ({ ...route.params }),
    },
    { path: "/login", component: Login },
    {
      path: "/statistics",
      name: "statistics",
      component: Statistics,
      props: (route) => ({ ...route.params }),
    },
  ],
});

createApp(App)
  .use(router)
  .use(Quasar, quasarUserOptions)
  .use(apolloProvider)
  .mount("#app");
