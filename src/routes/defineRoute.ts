import type { RouteRecordRaw } from 'vue-router';

export interface AppRouteMeta {}

export type AppRouteConfig = RouteRecordRaw & {
  meta?: AppRouteMeta;
  children?: AppRouteConfig[];
};
export type AppRoute = RouteRecordRaw & {
  meta?: AppRouteMeta;
};

export default function defineRoute(v: AppRouteConfig): AppRouteConfig {
  return v;
}
