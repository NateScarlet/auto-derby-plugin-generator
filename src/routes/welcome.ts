import defineRoute from '@/routes/defineRoute';

export default defineRoute({
  path: '',
  name: 'welcome',
  component: () => import('@/views/Welcome.vue'),
});
