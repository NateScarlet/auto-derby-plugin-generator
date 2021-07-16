import defineRoute from "@/utils/defineRoute";

export default defineRoute({
  path: "training",
  component: () => import("@/views/TrainingPlugin.vue"),
});
