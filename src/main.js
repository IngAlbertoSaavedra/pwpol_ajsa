import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import vuetify from "@/plugins/vuetify";
import "@/assets/global.css"
import "@/assets/ui.css"

//createApp(App).use(router).mount("#app");
createApp(App).use(router).use(vuetify).mount("#app");
