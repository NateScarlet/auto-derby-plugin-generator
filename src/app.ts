import { createApp } from "vue";
import globalComponents from "@/plugins/global-components";
import i18n from "@/plugins/i18n";
import pwa from "@/plugins/pwa";
import router from "@/plugins/router";
import App from "./App.vue";
import "./styles/index.scss";

const app = createApp(App);

(async () => {
  app.use(i18n);
  app.use(router);
  await globalComponents(app);
  app.mount("#app");
  pwa();
})();
