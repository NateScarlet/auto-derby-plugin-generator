import type { RouteRecordRaw } from "vue-router";

export type AppRoute = RouteRecordRaw;

export default function defineRoute(v: AppRoute): AppRoute {
  return v;
}
