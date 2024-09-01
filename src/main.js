import "./assets/main.css";
import "../node_modules/flowbite-vue/dist/index.css";

import { createApp } from "vue";
import App from "./App.vue";

import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const toastOptions = {
  autoClose: 1500,
  theme: "light",
};

// createApp(App).mount("#app");

const app = createApp(App);

app.use(Vue3Toastify, toastOptions);
app.mount("#app");
