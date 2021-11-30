import defineRoute from "@/utils/defineRoute";
import {} from "vue-router";

export default defineRoute({
  path: "",
  component: () => import("@/views/IndexView.vue"),
});
