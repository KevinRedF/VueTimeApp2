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
import authConfig from "../auth_config.json";
import { setupAuth } from "./auth";
import Callback from "./components/Callback";
import ErrorPage from "./components/Error";

import { routeGuard } from "@/auth";

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
    { path: "/", name: "home", component: MainPage, beforeEnter: routeGuard },
    { path: "/:catchAll(.*)", redirect: "/login" },

    { path: "/login", component: Login },
    {
      path: "/statistics",
      name: "statistics",
      component: Statistics,
      props: (route) => ({ ...route.params }),
    },
    {
      path: "/callback",
      name: "Callback",
      component: Callback,
    },
    {
      path: "/error",
      name: "Error",
      component: ErrorPage,
    },
  ],
});

let app = createApp(App)
  .use(router)
  .use(Quasar, quasarUserOptions)
  .use(apolloProvider);

function callbackRedirect() {
  router.push("/");
}
setupAuth(authConfig, callbackRedirect).then((auth) => {
  app.use(auth).mount("#app");
});
