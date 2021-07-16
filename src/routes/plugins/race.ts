import defineRoute from "@/utils/defineRoute";

export default defineRoute({
  path: "race",
  component: () => import("@/views/RacePlugin.vue")
})

