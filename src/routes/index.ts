import welcome from '@/routes/welcome';
import type { AppRoute } from '@/utils/defineRoute';
import plugins from './plugins';

function defineRoutes(v: AppRoute[]) {
  return v;
}

export default defineRoutes([welcome, plugins]);
