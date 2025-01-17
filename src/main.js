import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import axios from "axios";
import VueAxios from "vue-axios";
import "@/assets/tailwind.css";
import "@/assets/global.css";

import { VueQueryPlugin } from "vue-query";

const VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  },
};

import OrbitPosts from "@/lib/OrbitPosts.vue";
import OrbitInpursuitPosts from "@/lib/OrbitInpursuitPosts.vue";

const app = createApp(App);

app.component("OrbitPosts", OrbitPosts);
app.component("OrbitInpursuitPosts", OrbitInpursuitPosts);

app
  .use(VueQueryPlugin, VueQueryPluginOptions)
  .use(VueAxios, axios)
  .use(store)
  .use(router)
  .mount("#app");
