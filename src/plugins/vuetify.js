import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import { es } from "vuetify/locale";

export default createVuetify({
  locale: {
    locale: "es",
    fallback: "en",
    messages: { es },
  },
});
