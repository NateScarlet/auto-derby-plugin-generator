import defineRoute from "@/utils/defineRoute";
import race from "./race";
import training from "./training";

export default defineRoute({
  path: "/plugins",
  children: [race, training],
  component: () => import("@/views/PluginView.vue")
});
